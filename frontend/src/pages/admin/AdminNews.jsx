import { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import api from '../../utils/api';
import './AdminPages.css';

const EMPTY = { title: '', description: '', content: '', is_published: true };

const AdminNews = () => {
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
    // Use admin endpoint to get ALL news (including unpublished)
    api.get('news/admin/all')
      .then(r => setData(r.data.data || []))
      .catch(() => api.get('news').then(r => setData(r.data.data || [])))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(fetchData, []);

  const showAlert = (msg, type = 'success') => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openCreate = () => {
    setEditing(null); setForm(EMPTY);
    setImageFile(null); setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title || '',
      description: row.description || '',
      content: row.content || '',
      is_published: row.is_published === 1 || row.is_published === true,
    });
    setImagePreview(row.image || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('content', form.content);
    fd.append('is_published', form.is_published ? '1' : '0');
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editing) {
        await api.put(`/news/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('news', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      showAlert(editing ? 'อัปเดตข่าวสำเร็จ ✓' : 'เพิ่มข่าวสำเร็จ ✓');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showAlert(err.response?.data?.message || 'เกิดข้อผิดพลาด', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/news/${id}`); showAlert('ลบข่าวสำเร็จ'); fetchData(); }
    catch { showAlert('เกิดข้อผิดพลาด', 'error'); }
  };

  const fmtDate = (v) => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('th-TH'); } catch { return v; }
  };

  const cols = [
    { key: 'image', label: 'รูป', render: (v) => v
      ? <img src={v} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
      : <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>ไม่มีรูป</span> },
    { key: 'title', label: 'หัวข้อ' },
    { key: 'description', label: 'รายละเอียด', render: (v) => v ? v.slice(0, 60) + (v.length > 60 ? '...' : '') : '—' },
    { key: 'is_published', label: 'สถานะ', render: (v) =>
      <span className={`badge ${(v === 1 || v === true) ? 'badge-accent' : 'badge-primary'}`}>
        {(v === 1 || v === true) ? 'เผยแพร่' : 'ซ่อน'}
      </span> },
    { key: 'created_at', label: 'วันที่', render: fmtDate },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h1>จัดการข่าวสาร</h1><p>เพิ่ม แก้ไข ลบข่าวสาร</p></div>
        <button className="btn btn-primary" onClick={openCreate}>➕ เพิ่มข่าวสาร</button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="page-content">
        <div className="table-summary">ทั้งหมด <strong>{data.length}</strong> รายการ</div>
        <AdminTable columns={cols} data={data} onEdit={openEdit} onDelete={handleDelete} loading={loading} />
      </div>

      <AdminModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">รูปภาพ</label>
            <div className="image-upload-area">
              {imagePreview
                ? <img src={imagePreview} alt="preview" className="image-preview" />
                : <div className="image-upload-placeholder"><span>📷</span><p>คลิกเพื่ออัปโหลดรูป</p></div>}
              <input type="file" accept="image/*" onChange={handleImageChange} className="image-input" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">หัวข้อ *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">รายละเอียดสั้น</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">เนื้อหาเต็ม</label>
            <textarea className="form-control" rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
              <span className="form-label" style={{ margin: 0 }}>เผยแพร่ทันที</span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminNews;
