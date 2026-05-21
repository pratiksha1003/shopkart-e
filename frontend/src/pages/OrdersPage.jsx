import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiRefreshCw, FiXCircle } from 'react-icons/fi';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { formatPrice } from '../utils/formatPrice';
import { formatCancelCountdown } from '../utils/orderHelpers';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import api from '../utils/api';
import Loader from '../components/layout/Loader';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 10000;

const OrdersContent = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [, setTick] = useState(0);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data);
      setLastUpdated(new Date());
    } catch {
      if (!silent) toast.error(t('admin.loadFailed'));
    }
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const poll = setInterval(() => fetchOrders(true), POLL_INTERVAL);
    return () => clearInterval(poll);
  }, [fetchOrders]);

  // Update cancel countdown every second
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const cancelOrder = async (orderId) => {
    if (!confirm(t('orders.cancelConfirm'))) return;
    setCancellingId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success(t('orders.cancelled'));
      fetchOrders(true);
    } catch (err) {
      toast.error(err.response?.data?.message || t('orders.cannotCancel'));
    }
    setCancellingId(null);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('orders.title')}</h1>
          <p className="text-sm text-gray-500">
            {t('orders.autoSync', { seconds: POLL_INTERVAL / 1000 })}
            {lastUpdated && ` · ${t('orders.lastSync', { time: lastUpdated.toLocaleTimeString() })}`}
          </p>
        </div>
        <button type="button" onClick={() => fetchOrders(true)} className="btn-secondary gap-2 text-sm">
          <FiRefreshCw size={16} /> {t('orders.refresh')}
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 text-gray-500">{t('orders.noOrders')}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => {
            const countdown = o.cancelEligible ? formatCancelCountdown(o.cancelTimeRemainingMs) : null;
            return (
              <div key={o._id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/30">
                  <div>
                    <p className="font-mono text-sm font-medium">#{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <OrderStatusBadge status={o.status} pulse />
                </div>
                <div className="p-4">
                  <p className="font-semibold">{formatPrice(o.totalPrice)} · {o.orderItems.length} {t('common.items')}</p>
                  <p className="text-sm text-gray-500 capitalize">{t('orders.payment')}: {o.paymentMethod}</p>
                  <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {o.orderItems.slice(0, 3).map((item, i) => (
                      <li key={i}>{item.name} ×{item.qty}</li>
                    ))}
                    {o.orderItems.length > 3 && <li>{t('orders.more', { count: o.orderItems.length - 3 })}</li>}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link to={`/order/${o._id}`} className="text-sm font-medium text-primary-600 hover:underline">
                      {t('orders.viewInvoice')}
                    </Link>
                    {o.cancelEligible && countdown && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(o._id)}
                        disabled={cancellingId === o._id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400"
                      >
                        <FiXCircle size={14} />
                        {cancellingId === o._id ? t('orders.cancelling') : t('orders.cancelLeft', { time: countdown })}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => (
  <ProtectedRoute>
    <OrdersContent />
  </ProtectedRoute>
);

export default OrdersPage;
