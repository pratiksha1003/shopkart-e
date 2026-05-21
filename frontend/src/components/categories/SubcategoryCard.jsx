import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Subcategory card with image, hover zoom, and product count badge
 */
const SubcategoryCard = ({ mainSlug, subcategory, isActive }) => {
  const { t } = useTranslation();
  return (
  <Link
    to={`/category/${mainSlug}?subcategory=${subcategory._id}`}
    className={`card-hover group overflow-hidden ${
      isActive ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-950' : ''
    }`}
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        src={subcategory.image}
        alt={subcategory.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
      {subcategory.productCount > 0 && (
        <span className="absolute right-2 top-2 rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow">
          {t('category.items', { count: subcategory.productCount })}
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white">
        {subcategory.name}
      </h3>
      {subcategory.description && (
        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{subcategory.description}</p>
      )}
      <span className="mt-2 inline-block text-sm font-medium text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
        {t('category.shopNow')}
      </span>
    </div>
  </Link>
  );
};

export default SubcategoryCard;
