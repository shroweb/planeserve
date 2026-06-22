import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:8080";

const trustedOrigins =
  process.env.NODE_ENV === "production"
    ? [baseURL]
    : [baseURL, "http://localhost:8080", "http://localhost:8083", "http://localhost:3000"];

type AuthLike = {
  handler: (request: Request) => Promise<Response> | Response;
  api: Record<string, (...args: any[]) => Promise<any>>;
};

let authPromise: Promise<AuthLike> | undefined;

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[PlaneServe] Email to ${to} — ${subject}`);
    console.warn(`[PlaneServe] Body: ${html}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "PlaneServe <ops@planeserve.aero>";
  await resend.emails.send({ from, to, subject, html });
}

async function createConfiguredAuth(): Promise<AuthLike> {
  if (!connectionString) {
    throw new Error("Database not configured");
  }

  const [{ betterAuth }, { tanstackStartCookies }, { Pool }] = await Promise.all([
    import("better-auth"),
    import("better-auth/tanstack-start"),
    import("pg"),
  ]);

  return betterAuth({
    appName: "PlaneServe",
    baseURL,
    trustedOrigins,
    secret: process.env.BETTER_AUTH_SECRET,
    database: new Pool({ connectionString }),
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({
        user,
        url,
      }: {
        user: { name?: string; email: string };
        url: string;
      }) => {
        const name = user.name ?? "there";
        await sendEmail(
          user.email,
          "Reset your PlaneServe password",
          `<p>Hi ${name}, <a href="${url}">reset your password</a>.</p>`,
        );
      },
    },
    user: {
      additionalFields: {
        isAdmin: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
      },
    },
    plugins: [tanstackStartCookies()],
  }) as AuthLike;
}

function getAuth() {
  authPromise ??= createConfiguredAuth();
  return authPromise;
}

function databaseNotConfiguredResponse() {
  return new Response(
    JSON.stringify({
      error: "database_not_configured",
      message: "PlaneServe auth requires DATABASE_URL to be configured.",
    }),
    {
      status: 503,
      headers: { "content-type": "application/json; charset=utf-8" },
    },
  );
}

export const auth = {
  handler: async (request: Request) => {
    if (!connectionString) return databaseNotConfiguredResponse();
    try {
      const configuredAuth = await getAuth();
      return await configuredAuth.handler(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      console.error("[auth] handler error:", error);
      return new Response(JSON.stringify({ error: "auth_init_failed", message, stack }), {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8" },
      });
    }
  },
  api: new Proxy(
    {},
    {
      get(_target, prop: string) {
        return async (...args: any[]) => {
          const configuredAuth = await getAuth();
          const method = configuredAuth.api[prop];
          if (typeof method !== "function") {
            throw new Error(`Unknown auth API method: ${prop}`);
          }
          return method(...args);
        };
      },
    },
  ) as AuthLike["api"],
};
