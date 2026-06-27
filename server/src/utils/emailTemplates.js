function formatCurrency(amount) {
  return `₹${Number(amount || 0).toFixed(2)}`;
}

function getCustomerName(order) {
  return order.user?.name || order.shippingAddress?.fullName || "Customer";
}

function getOrderId(order) {
  return order._id.toString();
}

function buildOrderItemsHtml(order) {
  return order.orderItems
    .map((item) => {
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            ${item.name}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${formatCurrency(item.subtotal)}
          </td>
        </tr>
      `;
    })
    .join("");
}

function buildBaseEmailLayout({ title, previewText, body }) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background: #f3f4f6; font-family: Arial, sans-serif; color: #111827;">
        <span style="display: none; visibility: hidden; opacity: 0; height: 0; width: 0;">
          ${previewText}
        </span>

        <div style="max-width: 640px; margin: 0 auto; padding: 24px;">
          <div style="background: #111827; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">MarketFlow</h1>
            <p style="margin: 6px 0 0; color: #d1d5db;">MERN E-Commerce Platform</p>
          </div>

          <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px;">
            ${body}

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

            <p style="font-size: 13px; color: #6b7280; margin: 0;">
              This is an automated email from MarketFlow. Please do not reply to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildOrderConfirmationEmail(order) {
  const customerName = getCustomerName(order);
  const orderId = getOrderId(order);

  const subject = `Order confirmed - #${orderId}`;

  const text = `
Hi ${customerName},

Your order has been placed successfully.

Order ID: ${orderId}
Order Status: ${order.orderStatus}
Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}
Total: ${formatCurrency(order.totalPrice)}

Thank you for shopping with MarketFlow.
  `.trim();

  const body = `
    <h2 style="margin-top: 0;">Order confirmed 🎉</h2>

    <p>Hi ${customerName},</p>

    <p>Your order has been placed successfully.</p>

    <div style="background: #f9fafb; padding: 16px; border-radius: 10px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Order ID:</strong> #${orderId}</p>
      <p style="margin: 0 0 8px;"><strong>Order Status:</strong> ${order.orderStatus}</p>
      <p style="margin: 0 0 8px;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p style="margin: 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
    </div>

    <h3>Order items</h3>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
          <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
          <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${buildOrderItemsHtml(order)}
      </tbody>
    </table>

    <div style="margin-top: 18px; text-align: right;">
      <p style="margin: 0 0 6px;">Items Price: ${formatCurrency(order.itemsPrice)}</p>
      <p style="margin: 0 0 6px;">Shipping: ${formatCurrency(order.shippingPrice)}</p>
      <p style="margin: 0 0 6px;">Discount: ${formatCurrency(order.discountPrice)}</p>
      <p style="font-size: 18px; margin: 8px 0 0;"><strong>Total: ${formatCurrency(order.totalPrice)}</strong></p>
    </div>

    <p style="margin-top: 24px;">Thank you for shopping with MarketFlow.</p>
  `;

  const html = buildBaseEmailLayout({
    title: subject,
    previewText: "Your MarketFlow order has been placed successfully.",
    body,
  });

  return {
    subject,
    text,
    html,
  };
}

function buildOrderStatusUpdateEmail(order, previousStatus) {
  const customerName = getCustomerName(order);
  const orderId = getOrderId(order);

  const subject = `Order status updated - #${orderId}`;

  const text = `
Hi ${customerName},

Your order status has been updated.

Order ID: ${orderId}
Previous Status: ${previousStatus}
Current Status: ${order.orderStatus}
Payment Status: ${order.paymentStatus}
Total: ${formatCurrency(order.totalPrice)}

Thank you for shopping with MarketFlow.
  `.trim();

  const body = `
    <h2 style="margin-top: 0;">Order status updated</h2>

    <p>Hi ${customerName},</p>

    <p>Your order status has been updated.</p>

    <div style="background: #f9fafb; padding: 16px; border-radius: 10px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Order ID:</strong> #${orderId}</p>
      <p style="margin: 0 0 8px;"><strong>Previous Status:</strong> ${previousStatus}</p>
      <p style="margin: 0 0 8px;"><strong>Current Status:</strong> ${order.orderStatus}</p>
      <p style="margin: 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
    </div>

    <p>Total amount: <strong>${formatCurrency(order.totalPrice)}</strong></p>

    <p>Thank you for shopping with MarketFlow.</p>
  `;

  const html = buildBaseEmailLayout({
    title: subject,
    previewText: `Your order is now ${order.orderStatus}.`,
    body,
  });

  return {
    subject,
    text,
    html,
  };
}

export { buildOrderConfirmationEmail, buildOrderStatusUpdateEmail };
