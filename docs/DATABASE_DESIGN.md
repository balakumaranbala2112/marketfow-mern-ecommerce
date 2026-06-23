# MarketFlow Database Design

## Main Collections

- users
- categories
- products
- carts
- orders
- reviews

## Relationships

- Product belongs to Category
- Product is created by Admin/User
- Cart belongs to User
- Cart contains embedded cart items
- Order belongs to User
- Order contains embedded order item snapshots
- Review belongs to User and Product

## User

Fields:

- name
- email
- password
- role: customer/admin
- avatar
- phone
- isBlocked
- passwordChangedAt
- passwordResetToken
- passwordResetExpires
- timestamps

## Category

Fields:

- name
- slug
- description
- image
- isActive
- timestamps

## Product

Fields:

- name
- slug
- description
- shortDescription
- price
- discountPrice
- category
- brand
- images
- stock
- sku
- ratingsAverage
- ratingsCount
- isActive
- isFeatured
- createdBy
- specifications
- timestamps

## Cart

Fields:

- user
- items
  - product
  - name
  - image
  - price
  - quantity
  - subtotal
- totalItems
- cartTotal
- timestamps

## Order

Fields:

- user
- orderItems
  - product
  - name
  - image
  - price
  - quantity
  - subtotal
- shippingAddress
  - fullName
  - phone
  - addressLine1
  - addressLine2
  - city
  - state
  - postalCode
  - country
- paymentMethod
- paymentStatus: pending/paid/failed/refunded
- paymentInfo
- orderStatus: pending/confirmed/processing/shipped/delivered/cancelled
- itemsPrice
- shippingPrice
- taxPrice
- discountPrice
- totalPrice
- coupon
- paidAt
- deliveredAt
- timestamps

## Review

Fields:

- user
- product
- rating
- comment
- isApproved
- timestamps

Unique rule:

- One user can review one product only once.

## Future Collections

- wishlists
- coupons
- payments
- notifications

## Design Decisions

- Cart items are embedded because they belong to one cart.
- Order items are embedded snapshots because order history should not change when product data changes.
- Product references Category because categories are independent.
- Review references User and Product because reviews connect both.
- Cart is stored in database so user cart survives refresh/login.
- Zustand will manage frontend UI/client state, but database remains the source of truth for cart and orders.