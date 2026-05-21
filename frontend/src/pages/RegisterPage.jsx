import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { register } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const submit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error(t('auth.passwordMismatch'));
    dispatch(register({ name: form.name, email: form.email, password: form.password }));
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <div className="card w-full overflow-hidden shadow-purple-lg">
        <div className="h-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />
        <div className="p-8">
        <h1 className="page-title text-center">{t('auth.createAccount')}</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input required placeholder={t('auth.fullName')} className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" required placeholder={t('auth.email')} className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" required minLength={6} placeholder={t('auth.password')} className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input type="password" required placeholder={t('auth.confirmPassword')} className="input-field" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? t('auth.creating') : t('auth.register')}</button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t('auth.hasAccount')} <Link to="/login" className="text-primary-600 font-medium">{t('auth.signIn')}</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
