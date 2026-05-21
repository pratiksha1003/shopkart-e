import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { fetchProduct, clearProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatPrice, calcDiscount } from '../utils/formatPrice';
import ProductGrid from '../components/products/ProductGrid';
import Loader from '../components/layout/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((s) => s.products);
  const { userInfo } = useSelector((s) => s.auth);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(fetchProduct(id));
    api.get(`/products/${id}/related`).then((r) => setRelated(r.data));
    if (userInfo) api.post(`/users/recent/${id}`).catch(() => {});
    return () => dispatch(clearProduct());
  }, [id, dispatch, userInfo]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.error(t('productDetail.loginToReview'));
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success(t('productDetail.reviewSubmitted'));
      dispatch(fetchProduct(id));
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('productDetail.submitFailed'));
    }
  };

  if (loading || !product) return <Loader fullScreen />;

  const discount = calcDiscount(product.price, product.comparePrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <img src={product.images?.[0]} alt={product.name} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{product.brand} · {product.category?.name}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-primary-500">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={i < Math.round(product.rating) ? 'fill-current' : ''} />
            ))}
            <span className="text-gray-600 dark:text-gray-400">{product.rating?.toFixed(1)} ({product.numReviews} {t('productDetail.reviews')})</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-sm font-semibold text-red-700">{discount}% {t('products.off').toLowerCase()}</span>
              </>
            )}
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{product.description}</p>
          <p className="mt-2 text-sm">{product.countInStock > 0 ? t('productDetail.inStock', { count: product.countInStock }) : t('productDetail.outOfStock')}</p>
          {product.countInStock > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="input-field w-20">
                {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <button onClick={() => dispatch(addToCart({ ...product, qty }))} className="btn-primary gap-2">
                <FiShoppingCart /> {t('products.addToCart')}
              </button>
              {userInfo && (
                <button onClick={() => api.post(`/users/wishlist/${id}`).then(() => toast.success(t('wishlist.updated'))).catch(() => toast.error(t('productDetail.wishlistFailed')))} className="btn-secondary p-2.5">
                  <FiHeart />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">{t('productDetail.customerReviews')}</h2>
        {userInfo && (
          <form onSubmit={submitReview} className="card mt-4 p-4 space-y-3">
            <select value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })} className="input-field w-32">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{t('productDetail.stars', { count: r })}</option>)}
            </select>
            <textarea required placeholder={t('productDetail.writeReview')} className="input-field" rows={3} value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
            <button type="submit" className="btn-primary">{t('productDetail.submitReview')}</button>
          </form>
        )}
        <div className="mt-4 space-y-4">
          {product.reviews?.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{r.name}</span>
                <span className="text-primary-500">{'★'.repeat(r.rating)}</span>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">{t('productDetail.related')}</h2>
          <div className="mt-6">
            <ProductGrid products={related} loading={false} />
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
