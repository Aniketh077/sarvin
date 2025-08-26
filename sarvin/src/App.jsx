import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailsPage/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage/OrderDetailsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SearchPage from "./pages/SearchPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders/AdminMainOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import ToastContainer from "./components/ui/ToastContainer";
import { ToastProvider } from "./contexts/ToastContext";
import ScrollToTop from "./components/ScrollToTop";
import { Provider } from "react-redux";
import { store } from "./store/store";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHomePage = location.pathname === "/";

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="min-h-screen">{children}</main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main
        className={`flex-1 ${!isHomePage ? "pt-8 md:pt-20" : "pt-16 lg:pt-24"}`}
      >
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <ScrollToTop />
              <Layout>
                <Routes>
                  {/* Customer Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/products/:collectionName"
                    element={<ProductsPage />}
                  />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/verify-email"
                    element={<EmailVerificationPage />}
                  />
                  <Route
                    path="/verify-email/:token"
                    element={<EmailVerificationPage />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                  />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route
                    path="/orders/:orderId"
                    element={<OrderDetailsPage />}
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedAdminRoute>
                        <AdminProducts />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <ProtectedAdminRoute>
                        <AdminOrders />
                      </ProtectedAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <ProtectedAdminRoute>
                        <AdminCustomers />
                      </ProtectedAdminRoute>
                    }
                  />
                </Routes>
              </Layout>
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
