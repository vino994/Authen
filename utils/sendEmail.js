import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
    await transporter.sendMail({
      from: `"J Movies App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default sendEmail;
