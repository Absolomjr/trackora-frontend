import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import { ROLES } from "../utils/constants";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductsList from "../pages/products/ProductsList";
import CategoriesList from "../pages/categories/CategoriesList";
import SuppliersList from "../pages/suppliers/SuppliersList";
import StockInList from "../pages/stock/StockInList";
import StockOutList from "../pages/stock/StockOutList";
import OrdersList from "../pages/sales/OrdersList";
import CustomersList from "../pages/customers/CustomersList";
import Reports from "../pages/reports/Reports";
import UsersList from "../pages/users/UsersList";
import Profile from "../pages/profile/Profile";
import ChangePassword from "../pages/profile/ChangePassword";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated app shell */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/products" element={<ProductsList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/suppliers" element={<SuppliersList />} />

          <Route path="/stock-in" element={<StockInList />} />
          <Route path="/stock-out" element={<StockOutList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/customers" element={<CustomersList />} />

          <Route path="/reports" element={<Reports />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Admin-only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allow={[ROLES.ADMIN]}>
                <UsersList />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirects & fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
