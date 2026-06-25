import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductsManagement from './pages/ProductsManagement';
import ProductForm from './pages/ProductForm';
import OrdersManagement from './pages/OrdersManagement';
import UsersManagement from './pages/UsersManagement';
import AuditTrail from './pages/AuditTrail';
import PendingApprovalPage from './pages/PendingApprovalPage';
import Storefront from './pages/Storefront';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistory from './pages/OrderHistory';
import NotFoundPage from './pages/NotFoundPage';

// Components
import CartModal from './components/CartModal';

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Landing Page (unauthenticated) */}
            <Route path="/welcome" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:productId"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <OrdersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <UsersManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit-log"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AuditTrail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending"
              element={<PendingApprovalPage />}
            />

            {/* Customer Routes */}
            <Route path="/store" element={<Storefront onShowCart={() => setCartOpen(true)} />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />

            {/* Default & 404 Routes */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Cart Modal */}
          <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
