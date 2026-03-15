import nodemailer from "nodemailer";

// Pull SMTP config at send time so env vars are already loaded.
const getSmtpConfig = () => ({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  from:
    process.env.SMTP_FROM ||
    "TrusonXchanger <no-reply@trusonxchanger.com>",
});

// Build a transporter only if SMTP is configured.
const buildTransporter = () => {
  const { host, port, secure, user, pass } = getSmtpConfig();
  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user
      ? {
          user,
          pass,
        }
      : undefined,
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  // Uses SMTP settings to send mail; skips if not configured.
  const { from } = getSmtpConfig();
  const transporter = buildTransporter();
  if (!transporter) {
    console.log("SMTP not configured. Email skipped:", { to, subject });
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
