import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategorySection = ({ categories }) => {
  const { t } = useTranslation();
  return (
    <section className="page-container animate-fade-in-up delay-100">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">{t('home.shopByCategory')}</h2>
          <p className="mt-1 text-gray-500">{t('home.browseCategories')}</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
        {categories?.map((cat) => (
          <Link
            key={cat._id}
            to={`/category/${cat.slug}`}
            className="card-hover group overflow-hidden text-center"
          >
            <div className="aspect-square overflow-hidden bg-primary-50 dark:bg-gray-800">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <p className="p-4 font-semibold text-gray-900 transition-colors group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
