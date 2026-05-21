import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HeroBanner = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-primary-500">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-in-up text-white">
            <span className="inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              {t('home.megaSale')}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t('home.heroTitle')}<br />
              <span className="text-primary-100">{t('home.heroTitle2')}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/90">{t('home.heroDesc')}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-xl bg-white px-7 py-3.5 font-bold text-primary-700 shadow-purple-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-purple-lg"
              >
                {t('home.shopNow')}
              </Link>
              <Link
                to="/products?featured=true"
                className="rounded-xl border-2 border-white/80 px-7 py-3.5 font-bold text-white transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
              >
                {t('home.featuredDeals')}
              </Link>
            </div>
          </div>
          <div className="hidden animate-fade-in-up delay-200 lg:block">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800"
              alt=""
              className="rounded-2xl shadow-2xl ring-4 ring-white/20 transition duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-px left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-gray-950" />
    </section>
  );
};

export default HeroBanner;
