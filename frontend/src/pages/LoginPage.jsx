import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login } from '../redux/slices/authSlice';

const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
      <div className="card w-full overflow-hidden shadow-purple-lg">
        <div className="h-1.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />
        <div className="p-8">
        <h1 className="page-title text-center">{t('auth.signIn')}</h1>
        <p className="mt-2 text-center text-sm text-gray-500">{t('auth.demoUser')}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input type="email" required placeholder={t('auth.email')} className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required placeholder={t('auth.password')} className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? t('auth.signingIn') : t('auth.signIn')}</button>
        </form>
        <p className="mt-4 text-center text-sm">
          {t('auth.noAccount')} <Link to="/register" className="text-primary-600 font-medium">{t('auth.register')}</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
