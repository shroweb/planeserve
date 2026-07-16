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
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
      <h2 style="font-size:20px;font-weight:600;margin:0 0 12px">${heading}</h2>
      <div style="color:#555;font-size:14px;line-height:1.6">${body}</div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <p style="color:#bbb;font-size:11px">Aircraft Program AOG Support · ops@aircraftprogram.com</p>
    </div>
  `;
}
