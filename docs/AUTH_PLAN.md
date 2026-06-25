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