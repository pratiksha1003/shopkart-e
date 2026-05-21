import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import api from '../utils/api';
import ProductGrid from '../components/products/ProductGrid';

const ProfileContent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setProfile(data);
      setForm({ name: data.name, email: data.email, phone: data.phone || '', password: '' });
    });
  }, []);

  const save = (e) => {
    e.preventDefault();
    const payload = { name: form.name, email: form.email, phone: form.phone };
    if (form.password) payload.password = form.password;
    dispatch(updateProfile(payload));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={save} className="card p-6 space-y-4">
          <input className="input-field" placeholder={t('auth.fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" className="input-field" placeholder={t('auth.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input-field" placeholder={t('profile.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" className="input-field" placeholder={t('profile.newPassword')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" className="btn-primary">{t('profile.saveChanges')}</button>
        </form>
        <div>
          <p className="text-sm text-gray-500">{t('profile.loggedInAs', { email: userInfo?.email })}</p>
          {userInfo?.isAdmin && <p className="mt-2 text-primary-600 font-medium">{t('profile.administrator')}</p>}
        </div>
      </div>
      {profile?.recentlyViewed?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">{t('profile.recentlyViewed')}</h2>
          <div className="mt-4"><ProductGrid products={profile.recentlyViewed} loading={false} /></div>
        </section>
      )}
    </div>
  );
};

const ProfilePage = () => (
  <ProtectedRoute><ProfileContent /></ProtectedRoute>
);

export default ProfilePage;
