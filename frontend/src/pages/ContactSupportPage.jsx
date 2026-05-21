import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import LiveSupportPanel from '../components/support/LiveSupportPanel';
import { COMPANY } from '../constants/company';

const ContactSupportContent = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('support.title')}</h1>
      <p className="mt-1 text-gray-500">{t('support.subtitle')}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FiMessageCircle className="text-primary-600" /> {t('support.liveHelp')}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('support.liveHelpDesc')}</p>
          </div>
          <div className="card space-y-3 p-4 text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <FiMail className="text-primary-600" /> {COMPANY.email}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FiPhone className="text-primary-600" /> {COMPANY.phone}
            </p>
          </div>
          <Link to="/orders" className="text-sm font-medium text-primary-600 hover:underline">
            {t('support.viewOrders')}
          </Link>
        </div>
        <div className="lg:col-span-2">
          <LiveSupportPanel />
        </div>
      </div>
    </div>
  );
};

const ContactSupportPage = () => (
  <ProtectedRoute>
    <ContactSupportContent />
  </ProtectedRoute>
);

export default ContactSupportPage;
