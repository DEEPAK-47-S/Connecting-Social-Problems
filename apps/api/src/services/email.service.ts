import { Resend } from 'resend';

// Initialize Resend with the provided API key
// We fall back to a dummy key if not set to prevent crashes during build
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export const sendOtpEmail = async (
  to: string,
  otp: string,
  name?: string
): Promise<void> => {
  const displayName = name || to.split('@')[0];

  // Always log OTP to console for seamless local development & debugging
  console.log('\n' + '═'.repeat(60));
  console.log(`🔐  [OTP NOTIFICATION]`);
  console.log(`👤  Recipient : ${to} (${displayName})`);
  console.log(`🔑  OTP CODE  : ${otp}`);
  console.log(`⏰  Valid for : 10 minutes`);
  console.log('═'.repeat(60) + '\n');

  // If we don't have a real API key configured, stop here (local dev mode)
  if (!process.env.RESEND_API_KEY) {
    console.log(`ℹ️ [EMAIL] RESEND_API_KEY not configured. Use the OTP above in console.`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Connecting Social Problem <onboarding@resend.dev>',
      to: [to],
      subject: `🔐 Your OTP Code: ${otp}`,
      html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#ec4899 100%);padding:36px 40px;text-align:center;">
                      <div style="font-size:28px;font-weight:900;color:#fff;font-style:italic;letter-spacing:-0.5px;">Connecting Social Problem</div>
                      <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px;">Citizen Complaint Portal</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="color:#374151;font-size:16px;margin:0 0 6px;font-weight:600;">Hello, ${displayName}! 👋</p>
                      <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">
                        Use the code below to complete your sign-in. This OTP expires in <strong>10 minutes</strong>.
                      </p>
                      <div style="background:linear-gradient(135deg,#eef2ff,#fdf4ff);border:2px dashed #a5b4fc;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
                        <div style="font-size:48px;font-weight:900;letter-spacing:14px;color:#4f46e5;font-family:'Courier New',monospace;line-height:1;">${otp}</div>
                        <div style="color:#6b7280;font-size:12px;margin-top:10px;">One-Time Password</div>
                      </div>
                      <div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
                        <p style="color:#92400e;font-size:13px;margin:0;">⚠️ Never share this code with anyone. Connecting Social Problem will never ask for your OTP.</p>
                      </div>
                      <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6;">
                        If you didn't request this, you can safely ignore this email. Your account is secure.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f3f4f6;">
                      <p style="color:#d1d5db;font-size:11px;margin:0;">© 2024 Connecting Social Problem Platform · Citizen-driven innovation</p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
          </html>
        `
    });

    if (error) {
      console.error(`⚠️ [EMAIL] Resend API error sending to ${to}:`, error);
      console.log(`💡 [EMAIL] The OTP code (${otp}) is still valid and displayed in console above.`);
      return;
    }

    console.log(`✅ [EMAIL] Successfully delivered via Resend API to: ${to} (ID: ${data?.id})`);
  } catch (err: any) {
    console.error(`⚠️ [EMAIL] Failed to send email via Resend to ${to}:`, err.message);
    console.log(`💡 [EMAIL] The OTP code (${otp}) is still valid and displayed in console above.`);
  }
};
