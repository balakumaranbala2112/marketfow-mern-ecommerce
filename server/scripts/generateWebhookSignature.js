import crypto from "node:crypto";

const webhookSecret = process.argv[2];
const payload = process.argv[3];

if (!webhookSecret || !payload) {
  console.log("Usage:");
  console.log("node scripts/generateWebhookSignature.js <secret> '<payload>'");
  process.exit(1);
}

const signature = crypto
  .createHmac("sha256", webhookSecret)
  .update(payload)
  .digest("hex");

console.log(signature);

/*

node scripts/generateWebhookSignature.js "YOUR_WEBHOOK_SECRET" "{\"event\":\"payment.failed\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_test_failed\",\"order_id\":\"order_xxx\",\"status\":\"failed\",\"error_description\":\"Payment failed during test\"}}}}"

*/
