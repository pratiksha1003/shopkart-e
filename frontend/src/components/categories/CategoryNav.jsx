import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { CATEGORY_SLUG_KEYS } from '../../utils/categoryLabels';

const CategoryNav = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(
    Object.entries(CATEGORY_SLUG_KEYS).map(([slug, key]) => ({ slug, name: t(key) }))
  );
  const location = useLocation();

  useEffect(() => {
    api.get('/categories?main=true').then(({ data }) => {
      if (data?.length) {
        setCategories(
          data.map((c) => ({
            slug: c.slug,
            name: CATEGORY_SLUG_KEYS[c.slug] ? t(CATEGORY_SLUG_KEYS[c.slug]) : c.name,
          }))
        );
      }
    });
  }, [t]);

  const activeSlug = location.pathname.startsWith('/category/')
    ? location.pathname.split('/category/')[1]?.split('?')[0]
    : null;

  const pillClass = (active) =>
    `shrink-0 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
      active
        ? 'bg-primary-600 text-white shadow-purple'
        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-primary-950/50 dark:hover:text-primary-300'
    }`;

  return (
    <nav className="border-b border-primary-100/80 bg-white dark:border-primary-900/30 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link to="/products" className={pillClass(location.pathname === '/products')}>
            {t('nav.allProducts')}
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/category/${cat.slug}`} className={pillClass(activeSlug === cat.slug)}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
