# MarketFlow Auth Plan

## Main Concepts

Authentication means verifying who the user is.

Authorization means checking what the user is allowed to do.

## User Roles

- customer
- admin

## Register Flow

1. Receive name, email, password.
2. Validate request body.
3. Check whether email already exists.
4. Hash password.
5. Create user with customer role by default.
6. Generate access token.
7. Send success response without password.

## Login Flow

1. Receive email and password.
2. Validate request body.
3. Find user by email and manually select password.
4. Check if user exists.
5. Check if user is blocked.
6. Compare entered password with hashed password.
7. Update lastLoginAt.
8. Generate access token.
9. Send success response without password.

## Protected Route Flow

1. Client sends Authorization header.
2. Backend reads Bearer token.
3. Backend verifies token.
4. Backend finds user from token payload.
5. Backend attaches user to req.user.
6. Controller can access logged-in user through req.user.

## Admin Authorization Flow

1. User must be authenticated first.
2. Backend checks req.user.role.
3. If role is admin, continue.
4. If role is not admin, return 403 Forbidden.

## Future Auth Features

- Refresh token
- Logout
- Forgot password
- Reset password
- Email verification
- Secure cookies
- Rate limiting login attempts

## First Auth APIs

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me

## Protected Future APIs

- Cart APIs
- Order APIs
- Profile APIs
- Review APIs

## Admin Future APIs

- Create product
- Update product
- Delete product
- Manage categories
- Manage orders
- Manage users
- Dashboard analytics

## Password Hashing Rules

- Never store plain passwords.
- Use bcrypt to hash passwords before saving.
- Password hashing happens in User pre-save middleware.
- Hash password only when password is created or changed.
- Use comparePassword method during login.
- Do not return password in normal API responses.
- Password changes should use user.save(), not findByIdAndUpdate().

## Register Flow

1. Receive name, email, password.
2. Validate request body.
3. Reject unknown fields such as role.
4. Normalize email to lowercase.
5. Check whether email already exists.
6. Create user with customer role by default.
7. User model hashes password before save.
8. Generate access token.
9. Send success response without password.

## JWT Access Token

The access token contains:

- userId
- role

The token does not contain:

- password
- reset token
- private profile data

## Login Flow

1. Receive email and password.
2. Validate request body.
3. Reject unknown fields.
4. Normalize email to lowercase.
5. Find user by email and manually select password.
6. If user does not exist, return generic invalid credentials error.
7. If user is blocked, return 403 Forbidden.
8. Compare entered password with hashed password.
9. If password is wrong, return generic invalid credentials error.
10. Update lastLoginAt.
11. Generate access token.
12. Send success response without password.

## Login Security Rules

- Do not reveal whether the email exists.
- Use the same error message for unknown email and wrong password.
- Do not return password in login response.
- Blocked users cannot login.
- Login response should include a short user object and access token.

## Protected Route Flow

1. Client sends Authorization header.
2. Header format must be Bearer token.
3. Backend extracts token from Authorization header.
4. Backend verifies access token.
5. Backend reads userId from token payload.
6. Backend finds current user in database.
7. If user does not exist, return 401.
8. If user is blocked, return 403.
9. Backend attaches user to req.user.
10. Protected controller uses req.user.

## Current Auth APIs

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me

## Admin Authorization Flow

1. User must be authenticated first using protect middleware.
2. protect middleware attaches current user to req.user.
3. authorizeRoles middleware checks req.user.role.
4. If role is admin, request continues.
5. If role is not admin, return 403 Forbidden.

## Current Protected APIs

Authenticated:

- GET /api/v1/auth/me

Admin only:

- POST /api/v1/categories
- PUT /api/v1/categories/:categoryId
- DELETE /api/v1/categories/:categoryId
- POST /api/v1/products
- PUT /api/v1/products/:productId
- DELETE /api/v1/products/:productId

Public:

- GET /api/v1/categories
- GET /api/v1/categories/:categoryId
- GET /api/v1/products
- GET /api/v1/products/:productId


## User Profile APIs

Authenticated users can manage their own profile.

Current profile APIs:

- GET /api/v1/users/profile
- PUT /api/v1/users/profile

Allowed profile update fields:

- name
- phone
- avatar

Blocked from profile update:

- email
- password
- role
- isBlocked
- emailVerified

Email change and password change require separate secure flows.

## Change Password Flow

1. User must be authenticated.
2. Receive currentPassword, newPassword, confirmPassword.
3. Validate request body.
4. Find current user and manually select password.
5. Compare currentPassword with stored password hash.
6. If current password is incorrect, return 401.
7. Ensure new password is different from current password.
8. Set user.password to newPassword.
9. Save user document.
10. User pre-save middleware hashes new password.
11. Return safe user response and new access token.

## Password Change Rules

- Do not update password with findByIdAndUpdate.
- Use user.save() so password hashing middleware runs.
- Do not return password in response.
- New password must be at least 8 characters.
- New password and confirm password must match.
- New password must be different from current password.

## Token Invalidation After Password Change

When a user changes password:

1. User model updates passwordChangedAt.
2. Old access tokens may still contain a valid signature.
3. protect middleware compares token iat with passwordChangedAt.
4. If token was issued before passwordChangedAt, reject the token.
5. User must login again or use the new token returned from password change.

## Stronger Protect Middleware Rules

- Token must exist in Authorization header.
- Token must use Bearer format.
- Token signature must be valid.
- Token must not be expired.
- User from token must still exist.
- User must not be blocked.
- Token must not be older than passwordChangedAt.

## Cart Auth Rules

Cart APIs are authenticated user APIs.

Current cart API:

- POST /api/v1/cart/items

Rules:

- User must be logged in.
- Cart belongs to req.user._id.
- Users cannot access another user's cart.
- Product must exist before adding to cart.
- Product must be active.
- Quantity must not exceed stock.
- If product already exists in cart, increase quantity.

## Cart Auth Rules

Cart APIs are authenticated user APIs.

Current cart APIs:

- GET /api/v1/cart
- POST /api/v1/cart/items
- PUT /api/v1/cart/items/:cartItemId
- DELETE /api/v1/cart/items/:cartItemId
- DELETE /api/v1/cart

Rules:

- User must be logged in.
- Cart belongs to req.user._id.
- Users cannot access another user's cart.
- Product must exist before adding to cart.
- Product must be active.
- Quantity must not exceed stock.
- If product already exists in cart, increase quantity.
- Updating quantity must recheck latest product stock.
- Removing an item must recalculate totals.
- Clearing cart keeps the cart document but removes all items.

## Order Auth Rules

Order APIs are authenticated user APIs.

Current order API:

- POST /api/v1/orders

Create order rules:

- User must be logged in.
- Order is created from req.user._id cart.
- User cannot send orderItems directly.
- Backend checks cart is not empty.
- Backend rechecks latest product existence.
- Backend rechecks product active status.
- Backend rechecks product stock.
- Backend recalculates latest product price.
- Backend creates order item snapshots.
- Backend reduces product stock.
- Backend clears cart after successful order creation.
- COD is the only payment method supported for now.

## Order Auth Rules

Order APIs are authenticated user APIs.

Current order APIs:

- POST /api/v1/orders
- GET /api/v1/orders/my-orders
- GET /api/v1/orders/:orderId

Create order rules:

- User must be logged in.
- Order is created from req.user._id cart.
- User cannot send orderItems directly.
- Backend checks cart is not empty.
- Backend rechecks latest product existence.
- Backend rechecks product active status.
- Backend rechecks product stock.
- Backend recalculates latest product price.
- Backend creates order item snapshots.
- Backend reduces product stock.
- Backend clears cart after successful order creation.
- COD is the only payment method supported for now.

Customer order read rules:

- User must be logged in.
- User can list only their own orders.
- User can view only an order that belongs to req.user._id.
- Invalid orderId returns 400.
- Missing order or another user's order returns 404.

## Admin Order Management

Admin order APIs:

- GET /api/v1/orders/admin
- GET /api/v1/orders/admin/:orderId
- PUT /api/v1/orders/admin/:orderId/status

Rules:

- Admin must be authenticated.
- Admin role is required.
- Admin can list all orders.
- Admin can view any order.
- Admin can update orderStatus only.
- Admin cannot update price fields through status API.
- Delivered orders cannot be changed backwards.
- Cancelled orders cannot be changed again.
- Cancelling an order restores product stock.
- Delivering a COD order marks paymentStatus as paid.

## Review Auth Rules

Review APIs:

- GET /api/v1/products/:productId/reviews
- POST /api/v1/products/:productId/reviews
- PUT /api/v1/products/:productId/reviews/:reviewId
- DELETE /api/v1/products/:productId/reviews/:reviewId

Rules:

- Anyone can view product reviews.
- User must be logged in to create a review.
- User can review only products they purchased and received.
- Order must contain the product.
- Order status must be delivered.
- One user can review one product only once.
- User can update only their own review.
- User can delete only their own review.
- Product ratingsAverage and ratingsCount must be recalculated after create, update, and delete.

## Wishlist Auth Rules

Wishlist APIs are authenticated user APIs.

Current wishlist APIs:

- GET /api/v1/wishlist
- POST /api/v1/wishlist/items
- DELETE /api/v1/wishlist/items/:productId

Rules:

- User must be logged in.
- Wishlist belongs to req.user._id.
- Users cannot access another user's wishlist.
- Wishlist stores product references.
- Product must exist before adding to wishlist.
- Product must be active before adding to wishlist.
- Same product cannot be added twice.
- Removing from wishlist removes only the product reference.
- Wishlist does not reduce stock.

## Admin User Management

Admin user management APIs:

- GET /api/v1/users/admin
- GET /api/v1/users/admin/:userId
- PUT /api/v1/users/admin/:userId/block
- PUT /api/v1/users/admin/:userId/unblock

Rules:

- Admin must be authenticated.
- Admin role is required.
- Admin can view all users.
- Admin can view one user.
- Admin can block customer accounts.
- Admin can unblock customer accounts.
- Admin cannot block their own account.
- Admin accounts cannot be blocked from this endpoint.
- Admin accounts cannot be unblocked from this endpoint.
- Role changes are not allowed in this stage.
- Blocked users cannot login.
- Blocked users cannot use existing tokens on protected routes.

## Admin Dashboard Analytics

Admin dashboard API:

- GET /api/v1/dashboard/admin/summary

Rules:

- Admin must be authenticated.
- Admin role is required.
- Dashboard includes user summary.
- Dashboard includes product summary.
- Dashboard includes order status summary.
- Dashboard includes payment status summary.
- Dashboard includes sales summary.
- Revenue is calculated from paid orders only.
- COD order revenue is counted after order is delivered and paymentStatus becomes paid.
- Dashboard includes recent orders for admin overview.

## Coupon Rules

Coupon admin APIs:

- POST /api/v1/coupons/admin
- GET /api/v1/coupons/admin

Coupon customer APIs:

- POST /api/v1/coupons/apply
- DELETE /api/v1/coupons/remove

Rules:

- Admin must be authenticated to create/view coupons.
- Customer must be authenticated to apply/remove coupons.
- Coupon applies to the current user's cart.
- Coupon code is unique.
- Coupon can be percentage or fixed discount.
- Coupon may have a minimum order amount.
- Coupon may have a maximum discount amount.
- Coupon may have a usage limit.
- Coupon must be active and not expired.
- Coupon usedCount increases only after successful order creation.
- Order stores coupon snapshot.
- Backend calculates discount and final total.

## Payment Preparation Rules

Payment methods:

- cod
- online

Current behavior:

- COD is enabled.
- Online payment is planned but blocked until gateway integration.
- COD paymentStatus starts as pending.
- COD paymentStatus becomes paid when admin marks the order delivered.

Payment security rules:

- Frontend must never decide payment success.
- Backend must verify payment before marking paymentStatus as paid.
- Payment provider secrets must stay only in backend environment variables.
- Payment signatures and raw provider responses should not be exposed in normal API responses.
- Order stores paymentInfo for provider-level references.

