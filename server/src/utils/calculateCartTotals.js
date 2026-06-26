function calculateCartTotals(cart) {
  cart.totalItems = cart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cart.cartTotal = cart.items.reduce((total, item) => {
    return total + item.subtotal;
  }, 0);

  return cart;
}

export default calculateCartTotals;
