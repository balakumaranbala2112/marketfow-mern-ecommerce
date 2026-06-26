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