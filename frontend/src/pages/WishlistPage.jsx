import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import ProductGrid from '../components/products/ProductGrid';
import api from '../utils/api';
import Loader from '../components/layout/Loader';

const WishlistContent = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setItems(data.wishlist || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader fullScreen />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{t('wishlist.title')}</h1>
      <div className="mt-6"><ProductGrid products={items} loading={false} /></div>
    </div>
  );
};

const WishlistPage = () => (
  <ProtectedRoute><WishlistContent /></ProtectedRoute>
);

export default WishlistPage;
