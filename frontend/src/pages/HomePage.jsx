import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import HeroBanner from '../components/home/HeroBanner';
import CategorySection from '../components/home/CategorySection';
import ProductGrid from '../components/products/ProductGrid';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts({ featured: 'true', limit: 8 }));
  }, [dispatch]);

  return (
    <>
      <HeroBanner />
      <CategorySection categories={categories} />
      <section className="page-container animate-fade-in-up delay-200">
        <div className="flex items-center justify-between">
          <h2 className="section-title">{t('home.featuredProducts')}</h2>
          <Link
            to="/products?featured=true"
            className="text-sm font-semibold text-primary-600 transition hover:text-primary-800 hover:underline"
          >
            {t('common.viewAll')} →
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={products} loading={loading} />
        </div>
      </section>
    </>
  );
};

export default HomePage;
