import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';
import { clearCart, setCoupon } from '../redux/slices/cartSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

const ADDRESS_FIELDS = ['street', 'city', 'state', 'zipCode', 'country'];

const CheckoutForm = () => {
  const { t } = useTranslation();
  const { cartItems, coupon } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'India', paymentMethod: 'COD',
  });

  const itemsPrice = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = itemsPrice > 500 ? 0 : 49;
  const tax = Number((0.18 * itemsPrice).toFixed(2));
  const discount = coupon?.discountAmount || 0;
  const total = itemsPrice + shipping + tax - discount;

  const applyCoupon = async () => {
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: itemsPrice });
      dispatch(setCoupon(data));
      toast.success(t('checkout.couponApplied', { amount: formatPrice(data.discountAmount) }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('checkout.invalidCoupon'));
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = cartItems.map((i) => ({
        product: i._id,
        name: i.name,
        image: i.images?.[0],
        price: i.price,
        qty: i.qty,
      }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: form,
        paymentMethod: form.paymentMethod,
        couponCode: coupon?.code || couponCode,
      });
      dispatch(clearCart());
      toast.success(t('checkout.orderPlaced'));
      navigate(`/order/${data._id}?confirmed=true`);
    } catch (err) {
      toast.error(err.response?.data?.message || t('checkout.orderFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-semibold">{t('checkout.shippingAddress')}</h2>
          {ADDRESS_FIELDS.map((field) => (
            <input
              key={field}
              required
              placeholder={t(`checkout.${field}`)}
              className="input-field"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
          <select className="input-field" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option value="COD">{t('checkout.cod')}</option>
            <option value="Card">{t('checkout.card')}</option>
            <option value="UPI">{t('checkout.upi')}</option>
          </select>
        </div>
        <div className="card p-6 h-fit">
          <h2 className="font-bold">{t('checkout.orderSummary')}</h2>
          <div className="mt-4 space-y-2 text-sm">
            {cartItems.map((i) => (
              <div key={i._id} className="flex justify-between">
                <span>{i.name} x{i.qty}</span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2">
              <span>{t('checkout.discount')}</span>
              <span>-{formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>{t('cart.total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input placeholder={t('checkout.couponPlaceholder')} className="input-field" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
            <button type="button" onClick={applyCoupon} className="btn-secondary shrink-0">{t('checkout.apply')}</button>
          </div>
          <p className="mt-2 text-xs text-gray-500">{t('checkout.couponHint')}</p>
          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? t('checkout.placing') : t('checkout.placeOrder')}
          </button>
        </div>
      </form>
    </div>
  );
};

const CheckoutPage = () => (
  <ProtectedRoute>
    <CheckoutForm />
  </ProtectedRoute>
);

export default CheckoutPage;
