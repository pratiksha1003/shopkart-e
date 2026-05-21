import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import { removeFromCart, updateCartQty } from '../redux/slices/cartSlice';

const CartPage = () => {
  const { t } = useTranslation();
  const { cartItems } = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  const itemsPrice = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = itemsPrice > 500 ? 0 : 49;
  const tax = Number((0.18 * itemsPrice).toFixed(2));
  const total = itemsPrice + shipping + tax;

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{t('cart.empty')}</h1>
        <Link to="/products" className="btn-primary mt-6 inline-block">{t('cart.continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{t('cart.title')} ({cartItems.length} {t('common.items')})</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="card flex gap-4 p-4">
              <img src={item.images?.[0]} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              <div className="flex-1">
                <Link to={`/product/${item._id}`} className="font-medium hover:text-primary-600">{item.name}</Link>
                <p className="text-primary-600 font-semibold">{formatPrice(item.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => item.qty > 1 && dispatch(updateCartQty({ id: item._id, qty: item.qty - 1 }))} className="btn-secondary p-1"><FiMinus /></button>
                  <span className="w-8 text-center">{item.qty}</span>
                  <button onClick={() => item.qty < item.countInStock && dispatch(updateCartQty({ id: item._id, qty: item.qty + 1 }))} className="btn-secondary p-1"><FiPlus /></button>
                </div>
              </div>
              <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-500 hover:text-red-700"><FiTrash2 size={20} /></button>
            </div>
          ))}
        </div>
        <div className="card h-fit p-6">
          <h2 className="font-bold text-lg">{t('cart.orderSummary')}</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>{t('cart.subtotal')}</span><span>{formatPrice(itemsPrice)}</span></div>
            <div className="flex justify-between"><span>{t('cart.shipping')}</span><span>{shipping === 0 ? t('common.free') : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span>{t('cart.tax')}</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between border-t pt-2 font-bold text-lg"><span>{t('cart.total')}</span><span>{formatPrice(total)}</span></div>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 block w-full text-center">{t('cart.proceedCheckout')}</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
