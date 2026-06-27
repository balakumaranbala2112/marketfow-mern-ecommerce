import {
  createEmailTransporter,
  getEmailFromAddress,
  isEmailConfigured,
} from "../src/config/email.js";

async function testEmail() {
  if (!isEmailConfigured()) {
    console.log("Email is not configured or EMAIL_ENABLED is false");
    console.log("Set EMAIL_ENABLED=true and provide SMTP credentials.");
    return;
  }

  const transporter = createEmailTransporter();

  await transporter.verify();

  const to = process.argv[2];

  if (!to) {
    console.log("Usage:");
    console.log("npm run test:email -- receiver@example.com");
    return;
  }

  const info = await transporter.sendMail({
    from: getEmailFromAddress(),
    to,
    subject: "MarketFlow email test",
    text: "MarketFlow email setup is working.",
    html: "<p><strong>MarketFlow</strong> email setup is working.</p>",
  });

  console.log("Test email sent successfully:");
  console.log(info.messageId);
}

testEmail().catch((err) => {
  console.error("Test email failed:", err.message);
  process.exit(1);
});
