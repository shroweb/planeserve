import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:8080";

// better-auth rejects state-changing requests (e.g. sign-out) whose Origin
// isn't trusted. The configured baseURL is always trusted; in non-production
// we also trust common localhost dev ports so a mismatched BETTER_AUTH_URL or
// dev port can't silently break auth.
const trustedOrigins = [
  baseURL,
  "https://aircraftprogram.com",
  "https://www.aircraftprogram.com",
  "https://planeserve.vercel.app",
  "http://localhost:8080",
  "http://localhost:8083",
  "http://localhost:3000",
];

type AuthLike = {
  handler: (request: Request) => Promise<Response> | Response;
  api: Record<string, (...args: any[]) => Promise<any>>;
};

let authPromise: Promise<AuthLike> | undefined;

async function sendEmail(to: string, subject: string, html: string) {
  const { sendEmail: sendTransactionalEmail } = await import("@/lib/email.server");
  return sendTransactionalEmail(to, subject, html);
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
    appName: "Aircraft Program",
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
          "Reset your Aircraft Program password",
          `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
            <img src="https://aircraftprogram.com/logo.png" alt="Aircraft Program" style="height:32px;margin-bottom:24px" />
            <h2 style="font-size:20px;font-weight:600;margin:0 0 12px">Reset your password</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px">
              Hi ${name}, we received a request to reset your Aircraft Program password.
              Click the button below to choose a new one. This link expires in 1 hour.
            </p>
            <a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600">
              Reset password
            </a>
            <p style="color:#999;font-size:12px;margin-top:24px;line-height:1.6">
              If you didn't request this, you can safely ignore this email.
              Your password won't change until you click the link above.
            </p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
            <p style="color:#bbb;font-size:11px">Aircraft Program AOG Support · ops@aircraftprogram.com</p>
          </div>
        `,
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
      message: "Aircraft Program auth requires DATABASE_URL to be configured.",
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
    const configuredAuth = await getAuth();
    return configuredAuth.handler(request);
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
