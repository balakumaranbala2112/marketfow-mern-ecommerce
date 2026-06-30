const routePaths = {
  home: "/",
  products: "/products",
  productDetails: "/products/:productId",

  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password/:resetToken",

  cart: "/cart",
  checkout: "/checkout",
  profile: "/profile",
  orders: "/orders",
  orderDetail: "/orders/:orderId",
  wishlist: "/wishlist",

  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminProducts: "/admin/products",
  adminProductCreate: "/admin/products/new",
  adminProductEdit: "/admin/products/:productId/edit",
  adminCategories: "/admin/categories",
  adminOrders: "/admin/orders",
  adminOrderDetail: "/admin/orders/:orderId",
  adminUsers: "/admin/users",
  adminCoupons: "/admin/coupons",

  notFound: "*",
};

export default routePaths;
