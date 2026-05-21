import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import api from '../../utils/api';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';
import Loader from '../../components/layout/Loader';
import AdminOrderManagement from '../../components/admin/AdminOrderManagement';
import AdminUserManagement from '../../components/admin/AdminUserManagement';
import AdminSupportPanel from '../../components/admin/AdminSupportPanel';

const tabs = ['products', 'categories', 'orders', 'users', 'coupons', 'support'];

const AdminDashboardContent = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState('products');
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'products') {
        const [p, c] = await Promise.all([api.get('/products?limit=50'), api.get('/categories')]);
        setData(p.data.products);
        setCategories(c.data.filter((cat) => cat.parent));
      } else if (tab === 'categories') {
        const { data: d } = await api.get('/categories');
        setData(d);
        const { data: all } = await api.get('/categories');
        setCategories(all.filter((cat) => !cat.parent));
      } else if (tab === 'orders') {
        const { data: d } = await api.get('/orders');
        setData(d);
      } else if (tab === 'users') {
        const { data: d } = await api.get('/users');
        setData(d);
      } else if (tab === 'coupons') {
        const { data: d } = await api.get('/coupons');
        setData(d);
      } else if (tab === 'support') {
        const { data: d } = await api.get('/support');
        setData(d);
      }
    } catch {
      toast.error(t('admin.loadFailed'));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const saveProduct = async (e) => {
    e.preventDefault();
    const slug = form.slug || form.name?.toLowerCase().replace(/\s+/g, '-');
    const payload = { ...form, slug, price: Number(form.price), comparePrice: Number(form.comparePrice || 0), countInStock: Number(form.countInStock) };
    try {
      if (editId) await api.put(`/products/${editId}`, payload);
      else await api.post('/products', payload);
      toast.success(t('admin.productSaved'));
      setForm({});
      setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    const slug = form.slug || form.name?.toLowerCase().replace(/\s+/g, '-');
    try {
      if (editId) await api.put(`/categories/${editId}`, { ...form, slug });
      else await api.post('/categories', { ...form, slug });
      toast.success(t('admin.categorySaved'));
      setForm({});
      setEditId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const saveCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', { ...form, discountPercent: Number(form.discountPercent), minOrderAmount: Number(form.minOrderAmount || 0), expiresAt: form.expiresAt || new Date('2027-12-31') });
      toast.success(t('admin.couponCreated'));
      setForm({});
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    }
  };

  const remove = async (endpoint, id) => {
    if (!confirm(t('admin.deleteConfirm'))) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      toast.success(t('admin.deleted'));
      load();
    } catch {
      toast.error(t('admin.deleteFailed'));
    }
  };

  const updateOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    toast.success(t('admin.statusUpdated'));
    load();
  };

  const tabLabel = (key) => t(`admin.${key}`, key);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
        <Link to="/" className="text-sm text-primary-600">← {t('common.backToStore')}</Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tabKey) => (
          <button key={tabKey} onClick={() => { setTab(tabKey); setForm({}); setEditId(null); }} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${tab === tabKey ? 'bg-primary-600 text-white' : 'btn-secondary'}`}>
            {tabLabel(tabKey)}
          </button>
        ))}
      </div>

      {loading ? <Loader fullScreen /> : (
        <div className="mt-8">
          {tab === 'products' && (
            <>
              <form onSubmit={saveProduct} className="card mb-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <input placeholder={t('admin.name')} className="input-field" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <select className="input-field" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">{t('admin.categoryLabel')}</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <input type="number" placeholder={t('admin.price')} className="input-field" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <input type="number" placeholder={t('admin.stock')} className="input-field" value={form.countInStock || ''} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} required />
                <input placeholder={t('admin.brand')} className="input-field" value={form.brand || ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                <input placeholder={t('admin.imageUrl')} className="input-field sm:col-span-2" value={form.images?.[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
                <textarea placeholder={t('admin.description')} className="input-field sm:col-span-2" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured || false} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> {t('admin.featuredLabel')}</label>
                <button type="submit" className="btn-primary">{editId ? t('admin.updateProduct') : t('admin.addProduct')}</button>
              </form>
              <div className="overflow-x-auto card">
                <table className="w-full text-sm">
                  <thead><tr className="border-b dark:border-gray-700"><th className="p-3 text-left">{t('admin.name')}</th><th>{t('admin.price')}</th><th>{t('admin.stock')}</th><th>{t('admin.actions')}</th></tr></thead>
                  <tbody>
                    {data.map((p) => (
                      <tr key={p._id} className="border-b dark:border-gray-800">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{formatPrice(p.price)}</td>
                        <td className="p-3">{p.countInStock}</td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => { setEditId(p._id); setForm({ ...p, category: p.category?._id || p.category }); }} className="text-primary-600 text-xs">{t('common.edit')}</button>
                          <button onClick={() => remove('/products', p._id)} className="text-red-600 text-xs">{t('common.delete')}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'categories' && (
            <>
              <form onSubmit={saveCategory} className="card mb-6 flex flex-wrap gap-3 p-4">
                <input placeholder={t('admin.name')} className="input-field flex-1" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <select className="input-field flex-1" value={form.parent || ''} onChange={(e) => setForm({ ...form, parent: e.target.value || null })}>
                  <option value="">{t('admin.mainCategory')}</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{t('admin.subOf', { name: c.name })}</option>
                  ))}
                </select>
                <input placeholder={t('admin.imageUrl')} className="input-field flex-1" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <button type="submit" className="btn-primary">{editId ? t('admin.updateCategory') : t('admin.addCategory')}</button>
              </form>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((c) => (
                  <div key={c._id} className="card flex justify-between p-4">
                    <span>{c.parent ? `↳ ${c.name}` : c.name}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(c._id); setForm(c); }} className="text-primary-600 text-xs">{t('common.edit')}</button>
                      <button onClick={() => remove('/categories', c._id)} className="text-red-600 text-xs">{t('common.delete')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'orders' && (
            <AdminOrderManagement orders={data} onStatusChange={updateOrderStatus} />
          )}

          {tab === 'users' && (
            <AdminUserManagement users={data} />
          )}

          {tab === 'support' && (
            <AdminSupportPanel tickets={data} onRefresh={load} />
          )}

          {tab === 'coupons' && (
            <>
              <form onSubmit={saveCoupon} className="card mb-6 flex flex-wrap gap-3 p-4">
                <input placeholder={t('admin.code')} className="input-field" value={form.code || ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                <input type="number" placeholder={t('admin.discountPercent')} className="input-field w-32" value={form.discountPercent || ''} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} required />
                <input type="number" placeholder={t('admin.minOrder')} className="input-field w-32" value={form.minOrderAmount || ''} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
                <button type="submit" className="btn-primary">{t('admin.addCoupon')}</button>
              </form>
              <div className="space-y-2">
                {data.map((c) => (
                  <div key={c._id} className="card flex justify-between p-4">
                    <span className="font-mono font-bold">{c.code}</span>
                    <span>{c.discountPercent}% {t('admin.off')} · {t('admin.used')} {c.usedCount}/{c.maxUses}</span>
                    <button onClick={() => remove('/coupons', c._id)} className="text-red-600 text-xs">{t('common.delete')}</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => (
  <ProtectedRoute adminOnly>
    <AdminDashboardContent />
  </ProtectedRoute>
);

export default AdminDashboard;
