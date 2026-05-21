import { useTranslation } from 'react-i18next';

const OrderStatusBadge = ({ status, pulse = false }) => {
  const { t } = useTranslation();
  const styles = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    processing: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200',
    approved: 'bg-primary-200 text-primary-900 dark:bg-primary-800/50 dark:text-primary-100',
    shipped: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
    delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status] || styles.pending} ${pulse ? 'animate-pulse-soft' : ''}`}
    >
      {t(`orders.status.${status}`, status)}
    </span>
  );
};

export default OrderStatusBadge;
