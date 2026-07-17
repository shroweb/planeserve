// Transactional email sender. Uses Resend when RESEND_API_KEY is set; otherwise
// logs to the console so dev/staging works without a key. Keep server-only.
export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[Aircraft Program] Email to ${to} — ${subject}`);
    console.warn(`[Aircraft Program] Body: ${html}`);
    return { ok: false, skipped: true, reason: "RESEND_API_KEY is not configured." };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM ?? "Aircraft Program <onboarding@resend.dev>";
  const { data, error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    console.error("[Aircraft Program] Resend email failed", { to, subject, from, error });
    throw new Error(error.message || "Resend rejected the email.");
  }
  console.info("[Aircraft Program] Resend email sent", { to, subject, from, id: data?.id });
  return { ok: true, id: data?.id };
}

// Minimal branded wrapper so transactional emails share one look.
export function emailLayout(heading: string, body: string) {
  // Gracefully style any standard anchor links in the email body
  const styledBody = body.replace(/<a\b/g, '<a style="color: #0f172a; font-weight: 600; text-decoration: underline;"');

  return `
    <div style="background-color: #f4f5f7; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
      <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border-top: 4px solid #0f172a;">
        
        <!-- Header with Logo -->
        <div style="padding: 32px 32px 16px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <img src="https://www.aircraftprogram.com/logo.png" alt="Aircraft Program" style="height: 32px; width: auto; display: inline-block;" />
        </div>

        <!-- Main Content Body -->
        <div style="padding: 32px;">
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; line-height: 1.3;">${heading}</h2>
          <div style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 8px;">${styledBody}</div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 4px; font-weight: 600;">Aircraft Program AOG Support</p>
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            <a href="mailto:ops@aircraftprogram.com" style="color: #0f172a; text-decoration: none;">ops@aircraftprogram.com</a> · 
            <a href="https://www.aircraftprogram.com" style="color: #0f172a; text-decoration: none;">www.aircraftprogram.com</a>
          </p>
          <p style="color: #cbd5e1; font-size: 10px; margin: 16px 0 0;">
            This email was sent by Aircraft Program. You are receiving this because you are enrolled in the AOG Support network.
          </p>
        </div>

      </div>
    </div>
  `;
}
