import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const result = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log("📩 Email sent:", result);
    return result;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};

export default sendEmail;
