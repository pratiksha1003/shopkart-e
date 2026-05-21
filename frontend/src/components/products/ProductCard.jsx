import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { formatPrice, calcDiscount } from '../../utils/formatPrice';
import { addToCart } from '../../redux/slices/cartSlice';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);
  const discount = calcDiscount(product.price, product.comparePrice);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error(t('productDetail.loginWishlist'));
      return;
    }
    try {
      await api.post(`/users/wishlist/${product._id}`);
      toast.success(t('wishlist.updated'));
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="card-hover group overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-primary-50/50 dark:bg-gray-800">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {discount}% {t('products.off')}
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute right-3 top-3 rounded-lg bg-primary-600 px-2.5 py-1 text-xs font-bold text-white shadow-purple">
            {t('products.featured')}
          </span>
        )}
        <button
          onClick={toggleWishlist}
          className="absolute bottom-3 right-3 rounded-full bg-white p-2.5 text-red-500 opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:text-red-600 dark:bg-gray-900"
        >
          <FiHeart size={18} />
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-primary-600/80">{product.brand}</p>
        <h3 className="mt-1.5 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-primary-700 dark:text-white dark:group-hover:text-primary-300">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-primary-600">
          <FiStar className="fill-primary-500 text-primary-500" size={14} />
          <span className="font-medium">{product.rating?.toFixed(1) || '0'}</span>
          <span className="text-gray-400">({product.numReviews})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(addToCart(product));
          }}
          className="btn-primary mt-4 w-full gap-2 py-2.5"
        >
          <FiShoppingCart size={16} /> {t('products.addToCart')}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
