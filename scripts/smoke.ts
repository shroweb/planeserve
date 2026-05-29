const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:8083";

type Check = {
  name: string;
  run: () => Promise<void>;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function cookieFrom(response: Response) {
  const cookie = response.headers.get("set-cookie")?.split(";")[0];
  assert(cookie, "Expected a Set-Cookie header");
  return cookie;
}

async function json(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

async function signIn(email: string, password: string) {
  const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: baseUrl,
    },
    body: JSON.stringify({ email, password }),
  });
  assert(response.ok, `Sign in failed for ${email}: ${response.status}`);
  return cookieFrom(response);
}

async function createSmokeAdmin() {
  const email = `smoke-admin-${Date.now()}@planeserve.test`;
  const password = "planeserve-admin";
  const [{ auth }, { db, schema, pool }] = await Promise.all([
    import("../src/lib/auth"),
    import("../src/lib/db/index.server"),
  ]);

  const signup = await auth.api.signUpEmail({
    body: { email, password, name: "Smoke Admin" },
  });
  const userId = signup.user.id;

  await db.insert(schema.profiles).values({
    userId,
    name: "Smoke Admin",
    company: "PlaneServe",
    email,
    role: "Other",
    isAdmin: true,
  });

  await pool.end();
  return { email, password };
}

async function get(path: string, cookie?: string) {
  return fetch(`${baseUrl}${path}`, {
    headers: cookie ? { cookie } : undefined,
  });
}

const checks: Check[] = [
  {
    name: "API health is public",
    run: async () => {
      const response = await get("/api/v1/health");
      assert(response.status === 200, `Expected 200, got ${response.status}`);
      const body = await json(response);
      assert(body.ok === true, "Expected health ok=true");
    },
  },
  {
    name: "API me rejects anonymous users",
    run: async () => {
      const response = await get("/api/v1/me");
      assert(response.status === 401, `Expected 401, got ${response.status}`);
    },
  },
  {
    name: "Member can sign in and read own API data",
    run: async () => {
      const cookie = await signIn("demo@planeserve.aero", "planeserve-demo");
      const me = await get("/api/v1/me", cookie);
      assert(me.status === 200, `Expected /me 200, got ${me.status}`);
      const meBody = await json(me);
      const user = meBody.data as Record<string, unknown> | undefined;
      assert(user?.email === "demo@planeserve.aero", "Expected demo member email");

      const aircraft = await get("/api/v1/aircraft", cookie);
      assert(aircraft.status === 200, `Expected aircraft 200, got ${aircraft.status}`);

      const adminOverview = await get("/api/v1/admin/overview", cookie);
      assert(
        adminOverview.status === 403,
        `Expected admin overview 403, got ${adminOverview.status}`,
      );
    },
  },
  {
    name: "Admin can sign in and read admin API data",
    run: async () => {
      const admin = await createSmokeAdmin();
      const cookie = await signIn(admin.email, admin.password);
      const response = await get("/api/v1/admin/overview", cookie);
      assert(response.status === 200, `Expected admin overview 200, got ${response.status}`);
      const body = await json(response);
      assert(typeof body.data === "object" && body.data !== null, "Expected admin data object");
    },
  },
];

for (const check of checks) {
  try {
    await check.run();
    console.log(`✓ ${check.name}`);
  } catch (error) {
    console.error(`✗ ${check.name}`);
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
    break;
  }
}
