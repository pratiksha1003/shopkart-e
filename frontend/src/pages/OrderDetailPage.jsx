import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiDownload, FiXCircle } from 'react-icons/fi';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import OrderInvoice from '../components/invoice/OrderInvoice';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import { formatInvoiceNumber } from '../constants/company';
import { formatCancelCountdown } from '../utils/orderHelpers';
import api from '../utils/api';
import Loader from '../components/layout/Loader';
import toast from 'react-hot-toast';

const OrderDetailContent = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isConfirmed = searchParams.get('confirmed') === 'true';
  const [order, setOrder] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [, setTick] = useState(0);

  const loadOrder = () => api.get(`/orders/${id}`).then(({ data }) => setOrder(data));

  useEffect(() => {
    loadOrder();
    const poll = setInterval(loadOrder, 10000);
    return () => clearInterval(poll);
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const cancelOrder = async () => {
    if (!confirm(t('orders.cancelConfirm'))) return;
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrder(data);
      toast.success(t('orders.cancelled'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('orders.cannotCancel'));
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const { downloadOrderInvoicePdf } = await import('../utils/generateInvoicePdf');
      await downloadOrderInvoicePdf(order);
      toast.success(t('orders.invoiceDownloaded'));
    } catch {
      toast.error(t('orders.pdfFailed'));
    } finally {
      setDownloading(false);
    }
  };

  if (!order) return <Loader fullScreen />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Order confirmation banner */}
      {isConfirmed && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <FiCheckCircle className="mt-0.5 shrink-0 text-2xl text-green-600" />
          <div>
            <h1 className="text-xl font-bold text-green-800 dark:text-green-300">{t('orders.orderConfirmed')}</h1>
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">{t('orders.thankYou')}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isConfirmed ? t('orders.orderConfirmation') : t('orders.orderDetails')}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
            {formatInvoiceNumber(order._id)} · <OrderStatusBadge status={order.status} pulse />
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {order.cancelEligible && formatCancelCountdown(order.cancelTimeRemainingMs) && (
            <button type="button" onClick={cancelOrder} className="btn-secondary gap-2 border-red-200 text-red-700">
              <FiXCircle /> {t('orders.cancelLeft', { time: formatCancelCountdown(order.cancelTimeRemainingMs) })}
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="btn-primary gap-2"
          >
            <FiDownload size={18} />
            {downloading ? t('orders.generatingPdf') : t('orders.downloadInvoice')}
          </button>
          <Link to="/orders" className="btn-secondary">
            {t('orders.myOrders')}
          </Link>
        </div>
      </div>

      {/* Invoice */}
      <div className="mt-8">
        <OrderInvoice order={order} id="order-invoice" />
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        {t('orders.needHelp')}{' '}
        <Link to="/support" className="text-primary-600 hover:underline">{t('footer.contactSupport')}</Link>
      </p>
    </div>
  );
};

const OrderDetailPage = () => (
  <ProtectedRoute>
    <OrderDetailContent />
  </ProtectedRoute>
);

export default OrderDetailPage;
