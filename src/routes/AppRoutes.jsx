import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import { LoadingBlock } from "../components/common/Spinner";
import { ROLES } from "../utils/constants";

// Route-level code splitting: the marketing site, the auth pages and the
// authenticated app each become their own chunk, so a first-time visitor to the
// landing page never downloads the whole dashboard app.
const MarketingLayout = lazy(() => import("../components/landing/MarketingLayout"));
const Landing = lazy(() => import("../pages/landing/Landing"));
const Pricing = lazy(() => import("../pages/landing/Pricing"));
const About = lazy(() => import("../pages/landing/About"));
const Contact = lazy(() => import("../pages/landing/Contact"));
const Demo = lazy(() => import("../pages/landing/Demo"));
const Privacy = lazy(() => import("../pages/landing/Privacy"));
const Terms = lazy(() => import("../pages/landing/Terms"));

const Login = lazy(() => import("../pages/auth/Login"));
const CreateAccount = lazy(() => import("../pages/auth/CreateAccount"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ProductsList = lazy(() => import("../pages/products/ProductsList"));
const CategoriesList = lazy(() => import("../pages/categories/CategoriesList"));
const SuppliersList = lazy(() => import("../pages/suppliers/SuppliersList"));
const StockInList = lazy(() => import("../pages/stock/StockInList"));
const StockOutList = lazy(() => import("../pages/stock/StockOutList"));
const OrdersList = lazy(() => import("../pages/sales/OrdersList"));
const CustomersList = lazy(() => import("../pages/customers/CustomersList"));
const Reports = lazy(() => import("../pages/reports/Reports"));
const UsersList = lazy(() => import("../pages/users/UsersList"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const ChangePassword = lazy(() => import("../pages/profile/ChangePassword"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingBlock label="Loading…" />}>
        <Routes>
          {/* Public marketing site */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
