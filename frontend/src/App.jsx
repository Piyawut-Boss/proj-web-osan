import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public pages
import HomePage          from './pages/public/HomePage';
import AboutPage         from './pages/public/AboutPage';
import BoardPage         from './pages/public/BoardPage';
import ProductsPage      from './pages/public/ProductsPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import NewsPage          from './pages/public/NewsPage';
import NewsDetailPage    from './pages/public/NewsDetailPage';
import ReviewsPage       from './pages/public/ReviewsPage';
import CertificatesPage  from './pages/public/CertificatesPage';
import ContactPage       from './pages/public/ContactPage';

// Admin pages
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminNews      from './pages/admin/AdminNews';
import { AdminReviews, AdminCertificates, AdminBoardMembers, AdminBanners } from './pages/admin/AdminCRUD';
import AdminSettings  from './pages/admin/AdminSettings';
import AdminLayout    from './components/admin/AdminLayout';

import './styles/global.css';

// Protect admin routes — show nothing while auth is loading
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // wait for token validation
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"              element={<HomePage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/board"         element={<BoardPage />} />
        <Route path="/products"      element={<ProductsPage />} />
        <Route path="/products/:id"  element={<ProductDetailPage />} />
        <Route path="/news"          element={<NewsPage />} />
        <Route path="/news/:id"      element={<NewsDetailPage />} />
        <Route path="/reviews"       element={<ReviewsPage />} />
        <Route path="/certificates"  element={<CertificatesPage />} />
        <Route path="/contact"       element={<ContactPage />} />

        {/* ── Admin ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index             element={<AdminDashboard />} />
          <Route path="products"   element={<AdminProducts />} />
          <Route path="news"       element={<AdminNews />} />
          <Route path="reviews"    element={<AdminReviews />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="board-members" element={<AdminBoardMembers />} />
          <Route path="banners"    element={<AdminBanners />} />
          <Route path="settings"   element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
