import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut,
  FiPackage, FiMessageCircle,
} from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { toggleTheme } from '../../redux/slices/themeSlice';
import SearchBar from '../search/SearchBar';
import LanguageSelector from './LanguageSelector';
import { CATEGORY_SLUG_KEYS } from '../../utils/categoryLabels';

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const { mode } = useSelector((s) => s.theme);

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const categoryLinks = Object.entries(CATEGORY_SLUG_KEYS);

  const iconBtn =
    'rounded-xl p-2.5 text-gray-600 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-primary-950/50 dark:hover:text-primary-400';

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-primary-900/30 dark:bg-gray-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
          <Link to="/" className="group flex shrink-0 items-center gap-1 transition-transform duration-200 hover:scale-[1.02]">
            <span className="text-2xl font-extrabold tracking-tight text-primary-600">{t('common.shop')}</span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">{t('common.kart')}</span>
          </Link>

          <div className="hidden flex-1 max-w-xl md:block">
            <SearchBar />
          </div>

          <nav className="hidden items-center gap-0.5 lg:flex">
            <Link to="/products" className="nav-link">{t('nav.products')}</Link>
            {userInfo && (
              <>
                <Link to="/orders" className="nav-link inline-flex items-center gap-1.5">
                  <FiPackage size={16} className="shrink-0 text-primary-500" />
                  {t('nav.orders')}
                </Link>
                <Link to="/support" className="nav-link inline-flex items-center gap-1.5">
                  <FiMessageCircle size={16} className="shrink-0 text-primary-500" />
                  {t('nav.support')}
                </Link>
              </>
            )}
            {userInfo?.isAdmin && (
              <Link to="/admin" className="nav-link font-semibold text-primary-600 dark:text-primary-400">
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <LanguageSelector className="hidden sm:flex" />
            <button onClick={() => dispatch(toggleTheme())} className={iconBtn} aria-label={t('nav.toggleTheme')}>
              {mode === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <Link to="/wishlist" className={iconBtn} aria-label={t('nav.wishlist')}>
              <FiHeart size={20} />
            </Link>
            <Link to="/cart" className={`relative ${iconBtn}`} aria-label={t('nav.cart')}>
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-purple">
                  {cartCount}
                </span>
              )}
            </Link>
            {userInfo ? (
              <div className="relative group">
                <Link to="/profile" className={`${iconBtn} flex items-center gap-1.5`}>
                  <FiUser size={20} />
                  <span className="hidden text-sm font-semibold sm:inline">{userInfo.name?.split(' ')[0]}</span>
                </Link>
                <div className="invisible absolute right-0 top-full z-50 mt-2 w-40 translate-y-1 rounded-xl border border-primary-100 bg-white py-1 opacity-0 shadow-purple-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-primary-900/50 dark:bg-gray-900">
                  <button
                    type="button"
                    onClick={() => dispatch(logout())}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <FiLogOut size={14} /> {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary ml-1 text-sm py-2">{t('nav.login')}</Link>
            )}
            <button className={`${iconBtn} lg:hidden`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="animate-slide-down border-t border-primary-100 py-4 lg:hidden dark:border-primary-900/40">
            <div className="mb-4 flex flex-col gap-3">
              <LanguageSelector className="w-full [&_select]:w-full" />
              <div onClick={() => setMenuOpen(false)}>
                <SearchBar compact />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/products" onClick={() => setMenuOpen(false)} className="nav-link">{t('nav.products')}</Link>
              {userInfo && (
                <>
                  <Link to="/orders" onClick={() => setMenuOpen(false)} className="nav-link inline-flex items-center gap-2">
                    <FiPackage size={16} className="text-primary-500" /> {t('nav.orders')}
                  </Link>
                  <Link to="/support" onClick={() => setMenuOpen(false)} className="nav-link inline-flex items-center gap-2">
                    <FiMessageCircle size={16} className="text-primary-500" /> {t('nav.support')}
                  </Link>
                </>
              )}
              {categoryLinks.map(([slug, key]) => (
                <Link key={slug} to={`/category/${slug}`} onClick={() => setMenuOpen(false)} className="nav-link">
                  {t(key)}
                </Link>
              ))}
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="nav-link">{t('nav.cart')} ({cartCount})</Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="nav-link">{t('nav.wishlist')}</Link>
              {userInfo?.isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="nav-link font-semibold text-primary-600">
                  {t('nav.admin')}
                </Link>
              )}
              {userInfo && (
                <button
                  type="button"
                  onClick={() => { dispatch(logout()); setMenuOpen(false); }}
                  className="nav-link inline-flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <FiLogOut size={16} /> {t('nav.logout')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
