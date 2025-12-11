import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,                     // STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 20000,          // 20s
});

transporter.verify()
  .then(() => console.log("✅ SMTP Verified"))
  .catch(err => console.error("❌ SMTP Verify failed:", err.message));

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"J-Movies App" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("📩 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};

export default sendEmail;
