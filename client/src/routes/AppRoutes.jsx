import { Navigate, Route, Routes } from "react-router";

import AdminLayout from "../layouts/AdminLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminProductsPage from "../pages/admin/AdminProductsPage.jsx";
import AdminProductFormPage from "../pages/admin/AdminProductFormPage.jsx";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage.jsx";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage.jsx";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AdminCouponsPage from "../pages/admin/AdminCouponsPage.jsx";

import CartPage from "../pages/user/CartPage.jsx";
import CheckoutPage from "../pages/user/CheckoutPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";
import OrdersPage from "../pages/user/OrdersPage.jsx";
import OrderDetailPage from "../pages/user/OrderDetailPage.jsx";
import WishlistPage from "../pages/user/WishlistPage.jsx";

import HomePage from "../pages/public/HomePage.jsx";
import NotFoundPage from "../pages/public/NotFoundPage.jsx";
import ProductDetailsPage from "../pages/public/ProductDetailsPage.jsx";
import ProductsPage from "../pages/public/ProductsPage.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import routePaths from "./routePaths.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />

        <Route path={routePaths.products} element={<ProductsPage />} />
        <Route path={routePaths.productDetails} element={<ProductDetailsPage />} />

        <Route path={routePaths.login} element={<LoginPage />} />
        <Route path={routePaths.register} element={<RegisterPage />} />
        <Route path={routePaths.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={routePaths.resetPassword} element={<ResetPasswordPage />} />

        <Route
          path={routePaths.cart}
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={routePaths.checkout}
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={routePaths.profile}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path={routePaths.orders}
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={routePaths.orderDetail}
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path={routePaths.wishlist}
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path={routePaths.admin}
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={routePaths.adminDashboard} />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:productId/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
      </Route>

      <Route path={routePaths.notFound} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
