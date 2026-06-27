# MarketFlow Payment Plan

## Current Stage

Online payment is planned but not enabled yet.

Currently supported:

- COD order creation
- COD paymentStatus starts as pending
- COD paymentStatus becomes paid when admin marks order delivered

## Payment Methods

Application-level payment methods:

- cod
- online

Provider-level payment providers:

- cod
- razorpay
- stripe

## Important Security Rules

- Frontend must never decide payment success.
- Backend must verify payment before marking paymentStatus as paid.
- Backend must calculate order total.
- Gateway amount must match backend order total.
- Payment signatures/webhooks must be verified.
- Provider secrets must stay only in backend environment variables.
- Payment signature/raw gateway response should not be exposed in normal API responses.

## Razorpay Future Flow

1. User creates checkout intent.
2. Backend creates local pending order.
3. Backend creates Razorpay order.
4. Backend sends Razorpay order id and key id to frontend.
5. Frontend opens Razorpay Checkout.
6. Customer completes payment.
7. Frontend sends razorpay_order_id, razorpay_payment_id, and razorpay_signature to backend.
8. Backend verifies signature.
9. Backend marks order paymentStatus as paid.
10. Backend stores provider payment details.

## Stripe Future Flow

1. User creates checkout intent.
2. Backend creates local pending order.
3. Backend creates Stripe PaymentIntent.
4. Backend sends client_secret to frontend.
5. Frontend confirms payment with Stripe.js.
6. Backend verifies payment result or receives webhook.
7. Backend marks order paymentStatus as paid.
8. Backend stores provider payment details.

## Current Decision

For now, online payment requests are blocked with a validation error.

Reason:

- Razorpay/Stripe integration is a separate stage.
- Payment success must not be faked.

## Razorpay Integration Stage

Implemented APIs:

- POST /api/v1/payments/razorpay/create-order
- POST /api/v1/payments/razorpay/verify

Create Razorpay order flow:

1. User must be logged in.
2. Backend reads user's cart.
3. Backend validates product stock and active status.
4. Backend calculates latest order total.
5. Backend creates Razorpay order using backend key secret.
6. Backend creates local MarketFlow order with paymentStatus pending.
7. Backend stores Razorpay order id in paymentInfo.providerOrderId.
8. Backend returns keyId, Razorpay order id, amount, and currency to frontend.

Verify Razorpay payment flow:

1. Frontend receives razorpay_order_id, razorpay_payment_id, and razorpay_signature from Checkout.
2. Frontend sends those values to backend.
3. Backend finds local order.
4. Backend checks Razorpay order id matches local order paymentInfo.providerOrderId.
5. Backend generates HMAC SHA256 signature using providerOrderId and payment id.
6. Backend compares generated signature with razorpay_signature.
7. If valid, backend marks paymentStatus as paid.
8. If invalid, backend marks paymentStatus as failed.

Security rules:

- RAZORPAY_KEY_SECRET must never be exposed to frontend.
- Frontend must never decide payment success.
- Backend verifies signature before marking payment as paid.
- Failed signature verification must not fulfill the order.

## Razorpay Failure, Retry, and Cleanup

Implemented APIs:

- POST /api/v1/payments/razorpay/failure
- POST /api/v1/payments/razorpay/retry/:orderId
- PUT /api/v1/payments/admin/cleanup-pending-online-orders

Failure flow:

1. User starts Razorpay payment.
2. Razorpay payment fails or user closes Checkout.
3. Frontend can call failure API.
4. Backend marks paymentStatus as failed.
5. Order remains pending so the user can retry.

Retry flow:

1. User retries an unpaid online order.
2. Backend checks order belongs to user.
3. Backend checks order is not paid or cancelled.
4. Backend creates a new Razorpay order.
5. Backend updates paymentInfo.providerOrderId.
6. Backend does not reduce product stock again.

Cleanup flow:

1. Admin runs cleanup for expired pending online orders.
2. Backend finds unpaid old online orders.
3. Backend restores product stock only once.
4. Backend marks paymentStatus as failed.
5. Backend marks orderStatus as cancelled.
6. Backend sets stockRestoredAt and cancelledAt.

Future improvement:

- Add Razorpay webhook endpoint for payment.captured and payment.failed.
- Add scheduled cleanup job.
- Add refund workflow.

