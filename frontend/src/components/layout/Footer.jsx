import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto border-t border-primary-200/60 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-primary-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {t('common.shop')}<span className="text-primary-300">{t('common.kart')}</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-primary-200/90">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">{t('footer.shop')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-200/90">
              <li><Link to="/products" className="transition hover:text-white hover:underline">{t('footer.allProducts')}</Link></li>
              <li><Link to="/products?featured=true" className="transition hover:text-white hover:underline">{t('footer.featured')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">{t('footer.account')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-200/90">
              <li><Link to="/login" className="transition hover:text-white hover:underline">{t('footer.login')}</Link></li>
              <li><Link to="/register" className="transition hover:text-white hover:underline">{t('footer.register')}</Link></li>
              <li><Link to="/orders" className="transition hover:text-white hover:underline">{t('footer.orders')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">{t('footer.connect')}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-200/90">
              <li><Link to="/support" className="transition hover:text-white hover:underline">{t('footer.contactSupport')}</Link></li>
            </ul>
            <div className="mt-5 flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-primary-100 transition hover:bg-white/20 hover:text-white"
                  aria-hidden
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-primary-700/50 pt-8 text-center text-sm text-primary-300/80">
          © {new Date().getFullYear()} {t('common.shopKart')}. {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
