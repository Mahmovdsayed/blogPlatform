/**
 * The function `sendEmailService` sends an email using Nodemailer with specified options like
 * recipient, subject, and message.
 * @param {SendEmailOptions}  - The code you provided is a TypeScript function that sends an email
 * using Nodemailer. Here's an explanation of the parameters and the functionality of the code:
 * @returns The `sendEmailService` function returns a Promise that resolves to a boolean value. The
 * boolean value indicates whether the email was successfully accepted for delivery. If the
 * `info.accepted` array has at least one email address, the function will return `true`, indicating
 * that the email was accepted. Otherwise, it will return `false`.
 */
import nodemailer, { SentMessageInfo } from "nodemailer";

interface SendEmailOptions {
  to?: string;
  subject?: string;
  message?: string;
}

const sendEmailService = async ({
  to = "",
  subject = "no-reply",
  message = "<h1>no-message</h1>",
}: SendEmailOptions): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const info: SentMessageInfo = await transporter.sendMail({
    from: `"Blog Platform " <${process.env.EMAIL}>`,
    to,
    subject,
    html: message,
  });

  return info.accepted.length > 0;
};

export default sendEmailService;
