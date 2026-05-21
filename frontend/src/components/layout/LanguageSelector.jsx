import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';

const LANGUAGES = [
  { code: 'en', labelKey: 'language.en' },
  { code: 'hi', labelKey: 'language.hi' },
  { code: 'mr', labelKey: 'language.mr' },
];

const LanguageSelector = ({ className = '' }) => {
  const { i18n, t } = useTranslation();

  return (
    <div className={`relative flex items-center ${className}`}>
      <FiGlobe size={16} className="pointer-events-none absolute left-2.5 text-gray-500" aria-hidden />
      <select
        value={i18n.language?.split('-')[0] || 'en'}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="appearance-none rounded-xl border border-primary-100 bg-white py-2 pl-8 pr-8 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-primary-300 hover:shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 dark:border-primary-900/50 dark:bg-gray-900 dark:text-gray-200"
        aria-label={t('language.label')}
      >
        {LANGUAGES.map(({ code, labelKey }) => (
          <option key={code} value={code}>
            {t(labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
