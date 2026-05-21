import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import Loader from '../layout/Loader';

const ProductGrid = ({ products, loading }) => {
  const { t } = useTranslation();
  if (loading) return <Loader fullScreen />;
  if (!products?.length) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg">{t('products.noProducts')}</p>
        <p className="text-sm">{t('products.tryFilters')}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
