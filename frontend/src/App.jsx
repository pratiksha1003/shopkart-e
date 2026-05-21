import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { setTheme } from './redux/slices/themeSlice';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ContactSupportPage from './pages/ContactSupportPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.theme);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    dispatch(setTheme(mode));
  }, [dispatch, mode]);

  useEffect(() => {
    document.title = t('app.title');
    document.documentElement.lang = i18n.language?.split('-')[0] || 'en';
  }, [t, i18n.language]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            border: '1px solid #e9d5ff',
            background: '#fff',
            color: '#1f2937',
            boxShadow: '0 10px 40px -10px rgba(147, 51, 234, 0.2)',
          },
          success: { iconTheme: { primary: '#9333ea', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="support" element={<ContactSupportPage />} />
          <Route path="order/:id" element={<OrderDetailPage />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
