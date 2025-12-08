import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Password Reset" <noreply@example.com>`,
      to,
      subject,
      html
    });

    console.log("Email Sent Successfully");
  } catch (err) {
    console.error("Email Error:", err);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
