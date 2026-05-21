import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiChevronRight, FiGrid } from 'react-icons/fi';
import api from '../utils/api';
import { getCategoryLabel } from '../utils/getCategoryLabel';
import SubcategoryCard from '../components/categories/SubcategoryCard';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
import Loader from '../components/layout/Loader';

const CategoryPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const subcategory = searchParams.get('subcategory');
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    setLoading(true);
    api
      .get(`/categories/slug/${slug}`, { params: { subcategory, page, limit: 12 } })
      .then(({ data: res }) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug, subcategory, page]);

  const setSubcategory = (id) => {
    const params = new URLSearchParams();
    if (id) params.set('subcategory', id);
    params.set('page', '1');
    setSearchParams(params);
    document.getElementById('category-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <Loader fullScreen />;
  if (!data?.mainCategory) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t('category.notFound')}</h1>
        <Link to="/" className="btn-primary mt-6 inline-block">{t('common.goHome')}</Link>
      </div>
    );
  }

  const { mainCategory, subcategories, products, activeSubcategory, pages, total } = data;
  const mainName = getCategoryLabel(slug, mainCategory.name, t);

  return (
    <div className="animate-fade-in pb-12">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white">
        <div className="absolute inset-0 opacity-30">
          <img src={mainCategory.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/80">
            <Link to="/" className="hover:text-white">{t('common.home')}</Link>
            <FiChevronRight size={14} />
            <span className="text-white font-medium">{mainName}</span>
            {activeSubcategory && (
              <>
                <FiChevronRight size={14} />
                <span className="text-white font-medium">{activeSubcategory.name}</span>
              </>
            )}
          </nav>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{mainName}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">{mainCategory.description}</p>
          <p className="mt-2 text-sm text-white/70">{t('category.productsAvailable', { count: total })}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('category.shopSubcategory')}</h2>
            <p className="text-sm text-gray-500">{t('category.browseIn', { name: mainName })}</p>
          </div>
          {activeSubcategory && (
            <button
              type="button"
              onClick={() => setSubcategory(null)}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              {t('category.viewAllIn', { name: mainName })}
            </button>
          )}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subcategories.map((sub) => (
            <SubcategoryCard
              key={sub._id}
              mainSlug={slug}
              subcategory={sub}
              isActive={activeSubcategory?._id === sub._id}
            />
          ))}
        </div>
      </section>

      <section id="category-products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-10 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FiGrid className="text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {activeSubcategory ? activeSubcategory.name : t('category.allIn', { name: mainName })}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSubcategory(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                !activeSubcategory
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {t('category.all')}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                type="button"
                onClick={() => setSubcategory(sub._id)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeSubcategory?._id === sub._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <ProductGrid products={products} loading={false} />
        </div>
        <Pagination
          page={Number(page)}
          pages={pages}
          onPageChange={(p) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', String(p));
            setSearchParams(params);
          }}
        />
      </section>
    </div>
  );
};

export default CategoryPage;
