import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.MAILTRAP_SMTP_PORT || 2525),
  auth: {
    user: process.env.MAILTRAP_SMTP_USER || "5d16fcb371e759",
    pass: process.env.MAILTRAP_SMTP_PASS || "e48992057333c6",
  },
});

type Address = { name?: string; email: string };

export async function sendMail(options: {
  from: Address;
  to: Address[];
  subject: string;
  text?: string;
  html?: string;
}) {
  const mailOptions = {
    from: options.from.name
      ? `${options.from.name} <${options.from.email}>`
      : options.from.email,
    to: options.to.map((a) => a.email).join(","),
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("SMTP send error:", err);
    throw err;
  }
}

export default sendMail;
