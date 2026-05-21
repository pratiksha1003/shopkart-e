import { useTranslation } from 'react-i18next';
import { COMPANY, formatInvoiceNumber, formatOrderDate } from '../../constants/company';
import { formatPrice } from '../../utils/formatPrice';

const OrderInvoice = ({ order, id = 'order-invoice' }) => {
  const { t } = useTranslation();
  if (!order) return null;

  const customerName = order.user?.name || t('invoice.customer');
  const customerEmail = order.user?.email || '';
  const addr = order.shippingAddress;
  const invoiceNo = formatInvoiceNumber(order._id);

  return (
    <div id={id} className="card overflow-hidden bg-white text-gray-900 print:shadow-none dark:bg-white dark:text-gray-900">
      <div className="border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6 text-white sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/shopkart-logo.svg" alt={`${COMPANY.name} logo`} className="h-12 w-auto rounded-lg bg-white/10 p-1" />
            <div>
              <h2 className="text-xl font-bold">{COMPANY.name}</h2>
              <p className="text-sm text-white/90">{COMPANY.tagline}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm uppercase tracking-wider text-white/80">{t('invoice.taxInvoice')}</p>
            <p className="text-2xl font-bold">{invoiceNo}</p>
            <p className="mt-1 text-sm text-white/90">{t('invoice.orderId', { id: order._id.slice(-8).toUpperCase() })}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('invoice.billTo')}</h3>
            <p className="mt-2 font-semibold text-gray-900">{customerName}</p>
            {customerEmail && <p className="text-sm text-gray-600">{customerEmail}</p>}
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {addr.street}<br />
              {addr.city}, {addr.state} {addr.zipCode}<br />
              {addr.country}
            </p>
          </div>
          <div className="sm:text-right">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('invoice.invoiceDetails')}</h3>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="text-gray-500">{t('invoice.orderDate')}</dt>
                <dd className="font-medium text-gray-900">{formatOrderDate(order.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="text-gray-500">{t('invoice.payment')}</dt>
                <dd className="font-medium text-gray-900">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between gap-4 sm:justify-end">
                <dt className="text-gray-500">{t('invoice.status')}</dt>
                <dd className="font-medium capitalize text-gray-900">{t(`orders.status.${order.status}`, order.status)}</dd>
              </div>
              {order.couponCode && (
                <div className="flex justify-between gap-4 sm:justify-end">
                  <dt className="text-gray-500">{t('invoice.coupon')}</dt>
                  <dd className="font-medium text-gray-900">{order.couponCode}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          {COMPANY.address}, {COMPANY.city} · {COMPANY.email} · {t('invoice.gstin')}: {COMPANY.gstin}
        </p>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">{t('invoice.product')}</th>
                <th className="px-4 py-3 text-center">{t('invoice.qty')}</th>
                <th className="px-4 py-3 text-right">{t('invoice.unitPrice')}</th>
                <th className="px-4 py-3 text-right">{t('invoice.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{item.qty}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatPrice(item.price * item.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{t('invoice.subtotal')}</span>
              <span>{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('invoice.shipping')}</span>
              <span>{order.shippingPrice === 0 ? t('common.free') : formatPrice(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('invoice.taxGst')}</span>
              <span>{formatPrice(order.taxPrice)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>{t('invoice.discount')}</span>
                <span>-{formatPrice(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
              <span>{t('invoice.totalAmount')}</span>
              <span className="text-primary-600">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        <p className="border-t border-gray-100 pt-4 text-center text-xs text-gray-500">{t('invoice.thankYou')}</p>
      </div>
    </div>
  );
};

export default OrderInvoice;
