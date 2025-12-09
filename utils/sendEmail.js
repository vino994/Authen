import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"J Movies App" <noreply@jmails.com>`,
      to,
      subject,
      html,
    });

    console.log("Mail sent successfully using Mailtrap");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default sendEmail;
