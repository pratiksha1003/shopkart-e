import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../components/products/ProductGrid';
import ProductCard from '../components/products/ProductCard';
import Pagination from '../components/common/Pagination';
import { fetchProducts, fetchCategories } from '../redux/slices/productSlice';

const ProductsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { products, categories, loading, page, pages, total } = useSelector((s) => s.products);
  const visualState = location.state?.visualSearch ? location.state : null;

  const [filters, setFilters] = useState({
    keyword: params.get('keyword') || '',
    category: params.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: params.get('sort') || '',
    featured: params.get('featured') || '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (visualState) return;
    const query = {
      page: params.get('page') || 1,
      keyword: params.get('keyword') || undefined,
      category: params.get('category') || undefined,
      minPrice: params.get('minPrice') || undefined,
      maxPrice: params.get('maxPrice') || undefined,
      sort: params.get('sort') || undefined,
      featured: params.get('featured') || undefined,
    };
    dispatch(fetchProducts(query));
  }, [dispatch, params, visualState]);

  const applyFilters = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (filters.keyword) newParams.set('keyword', filters.keyword);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
    if (filters.sort) newParams.set('sort', filters.sort);
    if (filters.featured) newParams.set('featured', filters.featured);
    newParams.set('page', '1');
    setParams(newParams);
  };

  const displayProducts = visualState?.products ?? products;
  const similarProducts = visualState?.similar ?? [];
  const resultCount = visualState
    ? displayProducts.length + similarProducts.length
    : total;

  return (
    <div className="page-container animate-fade-in">
      {visualState ? (
        <div className="mb-6 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-white p-5 shadow-sm dark:border-primary-800 dark:from-primary-950/40 dark:to-gray-950">
          <div className="flex flex-wrap items-start gap-4">
            {visualState.previewImage && (
              <img
                src={visualState.previewImage}
                alt="Your search"
                className="h-20 w-20 rounded-lg object-cover ring-2 ring-primary-300"
              />
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('products.visualResults')}</h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {t('products.visualDesc')}
                {visualState.analysis?.terms?.length > 0 && (
                  <span className="ml-1">
                    ({visualState.analysis.terms.slice(0, 6).join(', ')})
                  </span>
                )}
              </p>
              {!visualState.exactMatch && (
                <p className="mt-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                  {t('products.noExactMatch')}
                </p>
              )}
            </div>
            <Link to="/products" className="btn-secondary text-sm" state={{}}>
              {t('products.clearVisual')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold">{t('products.title')}</h1>
          <p className="text-gray-500">
            {t('products.found', { count: total })} · {t('products.browseByCategory')}{' '}
            <Link to="/category/home-kitchen" className="text-primary-600 hover:underline">
              {t('categoryNav.homeKitchen')}
            </Link>
          </p>
        </>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-4">
        {!visualState && (
          <aside className="card p-4 lg:col-span-1 h-fit">
            <form onSubmit={applyFilters} className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('products.search')}</label>
                <input
                  className="input-field mt-1"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('products.category')}</label>
                <select
                  className="input-field mt-1"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">{t('products.all')}</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">{t('products.minPrice')}</label>
                  <input
                    type="number"
                    className="input-field mt-1"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">{t('products.maxPrice')}</label>
                  <input
                    type="number"
                    className="input-field mt-1"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>
              <div>
              <label className="text-sm font-medium">{t('products.sortBy')}</label>
              <select className="input-field mt-1" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
                <option value="">{t('products.newest')}</option>
                <option value="price-asc">{t('products.priceLowHigh')}</option>
                <option value="price-desc">{t('products.priceHighLow')}</option>
                <option value="rating">{t('products.topRated')}</option>
                <option value="name">{t('products.nameAZ')}</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">{t('products.applyFilters')}</button>
            </form>
          </aside>
        )}

        <div className={visualState ? 'lg:col-span-4' : 'lg:col-span-3'}>
          {visualState ? (
            <>
              {displayProducts.length > 0 && (
                <section>
                  <h2 className="mb-4 text-lg font-semibold">
                    {visualState.exactMatch ? t('products.matching') : t('products.closest')}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </section>
              )}
              {similarProducts.length > 0 && (
                <section className="mt-10">
                  <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {t('products.similarTitle')}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {similarProducts.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </section>
              )}
              {displayProducts.length === 0 && similarProducts.length === 0 && (
                <p className="py-16 text-center text-gray-500">{t('products.noSimilar')}</p>
              )}
            </>
          ) : (
            <>
              <ProductGrid products={products} loading={loading} />
              <Pagination
                page={page}
                pages={pages}
                onPageChange={(p) => {
                  params.set('page', p);
                  setParams(params);
                }}
              />
            </>
          )}
        </div>
      </div>
      {visualState && (
        <p className="mt-4 text-center text-sm text-gray-500">{t('products.visualResultCount', { count: resultCount })}</p>
      )}
    </div>
  );
};

export default ProductsPage;
