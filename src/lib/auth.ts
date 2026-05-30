import "dotenv/config";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No Resend key — log link so dev/staging still works
    console.warn(`[PlaneServe] Email to ${to} — ${subject}`);
    console.warn(`[PlaneServe] Body: ${html}`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "PlaneServe <ops@planeserve.aero>";
  await resend.emails.send({ from, to, subject, html });
}

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:8080";

// better-auth rejects state-changing requests (e.g. sign-out) whose Origin
// isn't trusted. The configured baseURL is always trusted; in non-production
// we also trust common localhost dev ports so a mismatched BETTER_AUTH_URL or
// dev port can't silently break auth.
const trustedOrigins =
  process.env.NODE_ENV === "production"
    ? [baseURL]
    : [baseURL, "http://localhost:8080", "http://localhost:8083", "http://localhost:3000"];

export const auth = betterAuth({
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
        `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
            <img src="https://planeserve.aero/logo.png" alt="PlaneServe" style="height:32px;margin-bottom:24px" />
            <h2 style="font-size:20px;font-weight:600;margin:0 0 12px">Reset your password</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px">
              Hi ${name}, we received a request to reset your PlaneServe password.
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
            <p style="color:#bbb;font-size:11px">PlaneServe AOG Support · ops@planeserve.aero</p>
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
});
