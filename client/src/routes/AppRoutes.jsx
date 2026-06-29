import { Navigate, Route, Routes } from "react-router";

import AdminLayout from "../layouts/AdminLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";

import CartPage from "../pages/user/CartPage.jsx";
import CheckoutPage from "../pages/user/CheckoutPage.jsx";
import ProfilePage from "../pages/user/ProfilePage.jsx";

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
        <Route path={routePaths.productDetails} element={<productDetails />} />

        <Route path={routePaths.login} element={<LoginPage />} />
        <Route path={routePaths.register} element={<RegisterPage />} />

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
      </Route>

      <Route path={routePaths.notFound} element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
