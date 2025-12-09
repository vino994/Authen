import dotenv from "dotenv";
dotenv.config(); // IMPORTANT

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log("MAIL SENT:", data);
  } catch (error) {
    console.error("Resend email error:", error);
  }
};

export default sendEmail;
