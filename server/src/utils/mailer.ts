import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or SMTP server
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });

  await transporter.sendMail({
    from: `"Email System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
