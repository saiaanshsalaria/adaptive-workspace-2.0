const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD
  ? nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
  })
  : null;

async function sendVerificationCode(email, code) {
  if (!transporter) {
    if (env.NODE_ENV === 'production') throw new Error('Email delivery is not configured');
    console.info(`[development] Verification code for ${email}: ${code}`);
    return;
  }
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: 'Verify your Adaptive Workspace email',
    text: `Your Adaptive Workspace verification code is ${code}. It expires in 10 minutes.`
  });
}

module.exports = { sendVerificationCode };
