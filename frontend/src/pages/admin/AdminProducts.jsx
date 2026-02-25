import { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import api, { getImageUrl } from '../../utils/api';
import './AdminPages.css';

const EMPTY = { name: '', name_en: '', category: 'psu_blen', description: '', description_en: '', ingredients: '', weight: '', is_active: true };

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchData = () => {
    setLoading(true);
    // Fetch all products including inactive for admin
    api.get('products/admin/all')
      .then(r => setData(r.data.data || []))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(fetchData, []);

  const showAlert = (msg, type = 'success') => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };

  const openCreate = () => {
    setEditing(null); setForm(EMPTY);
    setImageFile(null); setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '', name_en: row.name_en || '',
      category: row.category || 'psu_blen',
      description: row.description || '', description_en: row.description_en || '',
      ingredients: row.ingredients || '', weight: row.weight || '',
      is_active: row.is_active === 1 || row.is_active === true,
    });
    setImagePreview(row.image || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('name_en', form.name_en);
    fd.append('category', form.category);
    fd.append('description', form.description);
    fd.append('description_en', form.description_en);
    fd.append('ingredients', form.ingredients);
    fd.append('weight', form.weight);
    fd.append('is_active', form.is_active ? '1' : '0');
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      showAlert(editing ? 'อัปเดตผลิตภัณฑ์สำเร็จ ✓' : 'เพิ่มผลิตภัณฑ์สำเร็จ ✓');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/products/${id}`); showAlert('ลบผลิตภัณฑ์สำเร็จ'); fetchData(); }
    catch { showAlert('เกิดข้อผิดพลาด', 'error'); }
  };

  const CAT = { psu_blen: 'PSU Blen', meal_box: 'Meal Box', oem: 'OEM' };

  const columns = [
    { key: 'image', label: 'รูป', render: (v) => v
      ? <img src={v} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
      : <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>ไม่มีรูป</span> },
    { key: 'name', label: 'ชื่อสินค้า' },
    { key: 'name_en', label: 'English', render: (v) => v || <span style={{ color: 'var(--text-light)' }}>—</span> },
    { key: 'category', label: 'หมวดหมู่', render: (v) => <span className="badge badge-primary">{CAT[v] || v}</span> },
    { key: 'weight', label: 'น้ำหนัก', render: (v) => v || '—' },
    { key: 'is_active', label: 'สถานะ', render: (v) =>
      <span className={`badge ${(v === 1 || v === true) ? 'badge-accent' : 'badge-primary'}`}>
        {(v === 1 || v === true) ? '✓ เผยแพร่' : '✗ ซ่อน'}
      </span> },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h1>จัดการผลิตภัณฑ์</h1><p>เพิ่ม แก้ไข ลบผลิตภัณฑ์</p></div>
        <button className="btn btn-primary" onClick={openCreate}>➕ เพิ่มผลิตภัณฑ์</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="page-content">
        <div className="table-summary">ทั้งหมด <strong>{data.length}</strong> รายการ</div>
        <AdminTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขผลิตภัณฑ์' : 'เพิ่มผลิตภัณฑ์ใหม่'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">รูปภาพสินค้า</label>
            <div className="image-upload-area">
              {imagePreview
                ? <img src={imagePreview.startsWith('blob:') ? imagePreview : getImageUrl(imagePreview)} alt="preview" className="image-preview" />
                : <div className="image-upload-placeholder"><span>📷</span><p>คลิกเพื่ออัปโหลดรูป</p></div>}
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="image-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ชื่อสินค้า (ไทย) *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="เช่น PSU Blen 350g" />
            </div>
            <div className="form-group">
              <label className="form-label">ชื่อสินค้า (อังกฤษ)</label>
              <input className="form-control" value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} placeholder="e.g. PSU Blen 350g" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">หมวดหมู่ *</label>
              <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="psu_blen">PSU Blen</option>
                <option value="meal_box">Ready-to-Eat Meal Box</option>
                <option value="oem">OEM Service</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">น้ำหนัก</label>
              <input className="form-control" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="เช่น 350 กรัม" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">รายละเอียด (ไทย)</label>
            <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">รายละเอียด (อังกฤษ)</label>
            <textarea className="form-control" rows={2} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">ส่วนประกอบหลัก</label>
            <textarea className="form-control" rows={2} value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="เช่น Chicken, Rice, Soy Protein" />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              <span className="form-label" style={{ margin: 0 }}>แสดงในหน้าเว็บ</span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'กำลังบันทึก...' : '💾 บันทึก'}</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminProducts;
