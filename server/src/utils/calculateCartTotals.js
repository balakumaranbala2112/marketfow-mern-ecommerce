function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function calculateCouponDiscount(cart) {
  if (!cart.coupon) {
    return 0;
  }

  if (cart.cartTotal <= 0) {
    cart.coupon = null;
    return 0;
  }

  if (
    cart.coupon.minOrderAmount !== undefined &&
    cart.cartTotal < cart.coupon.minOrderAmount
  ) {
    cart.coupon = null;
    return 0;
  }

  let discount = 0;

  if (cart.coupon.discountType === "percentage") {
    discount = (cart.cartTotal * cart.coupon.discountValue) / 100;

    if (cart.coupon.maxDiscountAmount !== null) {
      discount = Math.min(discount, cart.coupon.maxDiscountAmount);
    }
  }

  if (cart.coupon.discountType === "fixed") {
    discount = cart.coupon.discountValue;
  }

  return roundMoney(Math.min(discount, cart.cartTotal));
}

function calculateCartTotals(cart) {
  cart.totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cart.cartTotal = cart.items.reduce((total, item) => {
    return total + item.subtotal;
  }, 0);

  cart.cartTotal = roundMoney(cart.cartTotal);

  cart.discountPrice = calculateCouponDiscount(cart);

  if (cart.coupon) {
    cart.coupon.discountAmount = cart.discountPrice;
  }

  cart.payableTotal = roundMoney(
    Math.max(cart.cartTotal - cart.discountPrice, 0),
  );

  return cart;
}

export default calculateCartTotals;
