import nodemailer from "nodemailer";

import env from "./env.js";

function createEmailTransporter() {
  return nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });
}

function getEmailFromAddress() {
  return `"${env.email.fromName}" <${env.email.fromAddress}>`;
}

function isEmailConfigured() {
  return Boolean(
    env.email.enabled &&
    env.email.host &&
    env.email.user &&
    env.email.pass &&
    env.email.fromAddress,
  );
}

export { createEmailTransporter, getEmailFromAddress, isEmailConfigured };
