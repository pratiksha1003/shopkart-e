import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatPrice';
import api from '../../utils/api';
import Loader from '../layout/Loader';
import OrderStatusBadge from '../orders/OrderStatusBadge';
import toast from 'react-hot-toast';

const AdminUserManagement = ({ users }) => {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadDetails = async (id) => {
    setSelectedId(id);
    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/users/${id}/admin-details`);
      setDetails(data);
    } catch {
      toast.error(t('admin.loadCustomerFailed'));
    }
    setLoadingDetail(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto">
        {users.map((u) => (
          <button
            key={u._id}
            type="button"
            onClick={() => loadDetails(u._id)}
            className={`card w-full p-4 text-left transition hover:shadow-md ${
              selectedId === u._id ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <p className="font-semibold">{u.name}</p>
            <p className="text-sm text-gray-500">{u.email}</p>
            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              <span>{t('admin.totalOrders', { count: u.orderCount ?? 0 })}</span>
              <span>{t('admin.totalSpent', { amount: formatPrice(u.totalSpent || 0) })}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-3">
        {loadingDetail && <Loader fullScreen />}
        {!selectedId && !loadingDetail && (
          <div className="card flex min-h-[300px] items-center justify-center p-8 text-gray-500">
            {t('admin.selectCustomer')}
          </div>
        )}
        {details && !loadingDetail && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-bold text-lg">{details.user.name}</h3>
              <p className="text-sm text-gray-600">{details.user.email}</p>
              {details.user.phone && <p className="text-sm">{t('admin.phone')}: {details.user.phone}</p>}
              {details.user.address?.street && (
                <p className="mt-2 text-sm text-gray-600">
                  {t('admin.savedAddress')}: {details.user.address.street}, {details.user.address.city}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-4 text-sm">
                <span><strong>{details.stats.totalOrders}</strong> {t('admin.orders')}</span>
                <span>{t('admin.totalSpent', { amount: formatPrice(details.stats.totalSpent) })}</span>
                <span className="text-red-600">{t('admin.cancelledOrders', { count: details.stats.cancelledOrders })}</span>
              </div>
            </div>

            <div className="card p-4">
              <h4 className="font-semibold mb-3">{t('admin.orderHistory')}</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {details.orders.map((o) => (
                  <div key={o._id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                    <div>
                      <p className="font-mono text-xs">#{o._id.slice(-8)}</p>
                      <p className="text-sm">{formatPrice(o.totalPrice)} · {o.paymentMethod}</p>
                      <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <h4 className="font-semibold mb-3">{t('admin.purchasedProducts')}</h4>
              <ul className="space-y-2 max-h-48 overflow-y-auto text-sm">
                {details.purchasedProducts.map((p, i) => (
                  <li key={i} className="flex justify-between gap-2 border-b border-gray-50 pb-2 dark:border-gray-800">
                    <span>{p.name} ×{p.qty}</span>
                    <span>{formatPrice(p.price * p.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
