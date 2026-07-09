import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(to: string, code: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"SICEPU" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Kode Verifikasi SICEPU",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; margin: 0;">
              <span style="color: #1e293b;">SI</span><span style="color: #2563eb;">CEPU</span>
            </h1>
          </div>
          <div style="background: #f8fafc; border-radius: 16px; padding: 32px; text-align: center; border: 1px solid #e2e8f0;">
            <h2 style="font-size: 18px; color: #1e293b; margin: 0 0 8px 0;">Kode Verifikasi Anda</h2>
            <p style="font-size: 14px; color: #64748b; margin: 0 0 24px 0;">Gunakan kode di bawah ini untuk verifikasi keamanan akun Anda.</p>
            <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #2563eb; background: white; border-radius: 12px; padding: 16px 24px; border: 2px dashed #2563eb; display: inline-block;">
              ${code}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 24px 0 0 0;">Kode ini berlaku selama <strong>5 menit</strong> dan hanya bisa digunakan <strong>3 kali</strong>.</p>
          </div>
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">
            Jika Anda tidak meminta kode ini, abaikan email ini. Akun Anda tetap aman.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("[EMAIL] Gagal mengirim OTP:", error);
    return false;
  }
}
