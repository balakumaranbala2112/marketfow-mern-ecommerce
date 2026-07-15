import {
  createEmailTransporter,
  getEmailFromAddress,
  isEmailConfigured,
} from "../config/email.js";

import logger from "../config/logger.js";

import {
  buildOrderConfirmationEmail,
  buildOrderStatusUpdateEmail,
  buildPasswordResetEmail,
} from "../utils/emailTemplates.js";

async function sendEmail({ to, subject, text, html }) {
  if (!isEmailConfigured()) {
    logger.warn("Email is not configured or EMAIL_ENABLED is false");
    return null;
  }

  const transporter = createEmailTransporter();

  return transporter.sendMail({
    from: getEmailFromAddress(),
    to,
    subject,
    text,
    html,
  });
}

async function safeSendEmail(emailPayload) {
  try {
    return await sendEmail(emailPayload);
  } catch (err) {
    logger.error("Email sending failed:", { error: err.message });
    return null;
  }
}

async function sendOrderConfirmationEmail(order) {
  const customerEmail = order.user?.email;

  if (!customerEmail) {
    logger.warn("Order confirmation email skipped: customer email missing");
    return null;
  }

  const template = buildOrderConfirmationEmail(order);

  return safeSendEmail({
    to: customerEmail,
    ...template,
  });
}

async function sendOrderStatusUpdateEmail(order, previousStatus) {
  const customerEmail = order.user?.email;

  if (!customerEmail) {
    logger.warn("Order status update email skipped: customer email missing");
    return null;
  }

  const template = buildOrderStatusUpdateEmail(order, previousStatus);

  return safeSendEmail({
    to: customerEmail,
    ...template,
  });
}

async function sendPasswordResetEmail({ user, resetUrl, expiresInMinutes }) {
  const template = buildPasswordResetEmail({
    user,
    resetUrl,
    expiresInMinutes,
  });

  return sendEmail({
    to: user.email,
    ...template,
  });
}

export {
  sendEmail,
  safeSendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail,
};
