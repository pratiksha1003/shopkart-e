import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUSES } from '../../utils/orderHelpers';
import OrderStatusBadge from '../orders/OrderStatusBadge';

const AdminOrderManagement = ({ orders, onStatusChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o._id} className="card overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
            <div>
              <p className="font-mono text-sm font-semibold">{t('admin.orderNumber', { id: o._id.slice(-8).toUpperCase() })}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {o.user?.name} · {o.user?.email}
              </p>
              <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={o.status} />
              <select
                value={o.status}
                onChange={(e) => onStatusChange(o._id, e.target.value)}
                className="input-field w-40 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{t(`orders.status.${s}`, s)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-3">
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500">{t('admin.customer')}</h4>
              <p className="mt-1 font-medium">{o.user?.name}</p>
              <p className="text-sm text-gray-600">{o.user?.email}</p>
              {o.user?.phone && <p className="text-sm text-gray-600">{o.user.phone}</p>}
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500">{t('admin.deliveryAddress')}</h4>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {o.shippingAddress?.street}<br />
                {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.zipCode}<br />
                {o.shippingAddress?.country}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase text-gray-500">{t('admin.paymentInfo')}</h4>
              <p className="mt-1 text-sm"><span className="text-gray-500">{t('admin.method')}:</span> {o.paymentMethod}</p>
              <p className="text-sm"><span className="text-gray-500">{t('admin.total')}:</span> <strong>{formatPrice(o.totalPrice)}</strong></p>
              <p className="text-sm"><span className="text-gray-500">{t('admin.paid')}:</span> {o.isPaid ? t('common.yes') : t('common.no')}</p>
              {o.couponCode && <p className="text-sm">{t('invoice.coupon')}: {o.couponCode}</p>}
            </div>
          </div>

          <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">{t('admin.orderedProducts')}</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500">
                    <th className="pb-2">{t('invoice.product')}</th>
                    <th className="pb-2">{t('invoice.qty')}</th>
                    <th className="pb-2 text-right">{t('admin.price')}</th>
                  </tr>
                </thead>
                <tbody>
                  {o.orderItems?.map((item, i) => (
                    <tr key={i} className="border-t border-gray-50 dark:border-gray-800">
                      <td className="py-2 flex items-center gap-2">
                        {item.image && <img src={item.image} alt="" className="h-8 w-8 rounded object-cover" />}
                        {item.name}
                      </td>
                      <td className="py-2">{item.qty}</td>
                      <td className="py-2 text-right">{formatPrice(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
              <span>{t('invoice.subtotal')}: {formatPrice(o.itemsPrice)}</span>
              <span>{t('invoice.shipping')}: {o.shippingPrice === 0 ? t('common.free') : formatPrice(o.shippingPrice)}</span>
              <span>{t('invoice.taxGst')}: {formatPrice(o.taxPrice)}</span>
              {o.discountAmount > 0 && <span className="text-green-600">{t('invoice.discount')}: -{formatPrice(o.discountAmount)}</span>}
            </div>
          </div>
        </div>
      ))}
      {!orders.length && <p className="text-center text-gray-500 py-8">{t('admin.noOrders')}</p>}
    </div>
  );
};

export default AdminOrderManagement;
