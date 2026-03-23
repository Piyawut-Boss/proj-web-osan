import { useState, useEffect, useCallback } from 'react';
import api from '../../utils/api';
import CarouselManager from '../../components/admin/CarouselManager';
import { invalidateSettings } from '../../hooks/useSettings';
import './AdminPages.css';

const SECTIONS = [
  { key:'showcase', label:'PSU Blen Showcase' },
  { key:'mealbox', label:'อาหารกล่อง' },
  { key:'today', label:'PSU Agro Food Today' },
  { key:'oem', label:'บริการ OEM' },
  { key:'products', label:'Products Page Banner' },
  { key:'timeline', label:'Timeline' },
  { key:'partners', label:'รูปพาร์ทเนอร์' },
  { key:'contact', label:'ติดต่อเรา' },
  { key:'footer', label:'Footer' },
];

export default function AdminSettings() {
  const [allSettings, setAllSettings] = useState([]);
  const [activeSection, setActiveSection] = useState('showcase');
  const [formData, setFormData] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const showAlert = (msg, type='success') => { setAlert({msg,type}); setTimeout(()=>setAlert(null),3500); };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    api.get('settings/admin').then(r => {
      const rows = r.data.data || [];
      setAllSettings(rows);
      const fd = {};
      rows.forEach(s => { fd[s.setting_key] = s.setting_value || ''; });
      setFormData(fd);
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const sectionSettings = allSettings.filter(s => s.section === activeSection);

  const handleChange = (key, val) => setFormData(prev => ({...prev, [key]: val}));

  const handleImage = (key, file) => {
    if (!file) return;
    setImageFiles(prev => ({...prev, [key]: file}));
    setImagePreviews(prev => ({...prev, [key]: URL.createObjectURL(file)}));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1) Upload any pending image files (from any section)
      for (const [key, file] of Object.entries(imageFiles)) {
        const fd = new FormData();
        fd.append('image', file);
        await api.put(`/settings/${key}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
      }
      // 2) Batch-save ALL text/textarea fields (all sections loaded in formData)
      const textFields = {};
      allSettings
        .filter(s => s.setting_type !== 'image')
        .forEach(s => { textFields[s.setting_key] = formData[s.setting_key] ?? ''; });
      if (Object.keys(textFields).length) {
        await api.put('settings/batch-update', { settings: textFields });
      }
      invalidateSettings();
      setImageFiles({});
      load();
      showAlert('บันทึกสำเร็จ');
    } catch(e) {
      showAlert('เกิดข้อผิดพลาด: ' + (e.response?.data?.message || e.message || 'ไม่ทราบสาเหตุ'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><div className="page-content" style={{textAlign:'center',padding:'80px'}}>กำลังโหลด...</div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h1>ตั้งค่าเนื้อหาเว็บไซต์</h1><p>แก้ไขข้อความและรูปภาพทุกส่วนของเว็บไซต์</p></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      <div className="settings-layout">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          {SECTIONS.map(sec => (
            <button key={sec.key} className={`settings-nav-btn${activeSection===sec.key?' active':''}`} onClick={() => setActiveSection(sec.key)}>
              {sec.label}
            </button>
          ))}
        </aside>

        {/* Form */}
        <div className="settings-form">
          <h2 className="settings-section-title">{SECTIONS.find(s=>s.key===activeSection)?.label}</h2>
          
          {/* CAROUSEL MANAGER FOR PRODUCTS */}
          {activeSection === 'products' && (
            <CarouselManager 
              section={activeSection}
              label="Slide Banner"
              onAlert={showAlert}
            />
          )}

          {sectionSettings.length === 0 && <p style={{color:'var(--text-light)'}}>ไม่มีการตั้งค่าในส่วนนี้</p>}
          {(() => {
            const filtered = sectionSettings.filter(s => {
              // For products section, hide ALL fields - ONLY carousel manager allowed
              if (activeSection === 'products') {
                return false; // Hide all fields for these sections
              }
              return true;
            });
            return <>
              {filtered.length === 0 && sectionSettings.length > 0 && <p style={{color:'var(--text-light)'}}>ใช้ Slide Banner ด้านบนเพื่อเพิ่มรูปภาพ</p>}
              {filtered.map(s => (
            <div key={s.setting_key} className="form-group">
              <label className="form-label">{s.label} <small style={{color:'var(--text-light)',fontWeight:400}}>({s.setting_key})</small></label>

              {s.setting_type === 'image' ? (
                <div className="settings-img-field">
                  <div className="settings-img-preview">
                    {(imagePreviews[s.setting_key] || s.display_value) ? (
                      <img src={imagePreviews[s.setting_key] || s.display_value} alt={s.label}/>
                    ) : (
                      <div className="settings-img-ph"><span>ยังไม่มีรูป</span></div>
                    )}
                  </div>
                  <div className="settings-img-actions">
                    <label className="btn btn-secondary" style={{cursor:'pointer'}}>
                      เลือกรูปภาพ
                      <input type="file" accept="image/*" style={{display:'none'}} onChange={e => handleImage(s.setting_key, e.target.files[0])}/>
                    </label>
                    {imageFiles[s.setting_key] && <span style={{fontSize:'.8rem',color:'var(--accent)'}}>เลือกรูปแล้ว</span>}
                    {s.display_value && !imageFiles[s.setting_key] && (
                      <a href={s.display_value} target="_blank" rel="noreferrer" style={{fontSize:'.78rem',color:'var(--secondary)'}}>ดูรูปปัจจุบัน</a>
                    )}
                  </div>
                </div>
              ) : s.setting_type === 'textarea' ? (
                <textarea className="form-control" rows={4} value={formData[s.setting_key]||''} onChange={e=>handleChange(s.setting_key,e.target.value)} placeholder={s.label}/>
              ) : (
                <input className="form-control" type="text" value={formData[s.setting_key]||''} onChange={e=>handleChange(s.setting_key,e.target.value)} placeholder={s.label}/>
              )}
            </div>
              ))}
            </>
          })()}

          {sectionSettings.length > 0 && (
            <div style={{marginTop:20,paddingTop:20,borderTop:'1px solid var(--border)'}}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'กำลังบันทึก...' : 'บันทึกส่วนนี้'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .settings-layout{display:grid;grid-template-columns:230px 1fr;gap:28px;margin-top:24px}
        .settings-sidebar{display:flex;flex-direction:column;gap:3px;background:#fafbfd;border-radius:14px;padding:14px;height:fit-content;position:sticky;top:80px;border:1px solid #e5e9f0}
        .settings-nav-btn{background:none;border:none;padding:10px 16px;border-radius:10px;text-align:left;cursor:pointer;font-size:.84rem;font-family:var(--font-thai);color:var(--text-medium);transition:all .15s;font-weight:500}
        .settings-nav-btn:hover{background:#eef2ff;color:var(--primary)}
        .settings-nav-btn.active{background:var(--primary);color:#fff;font-weight:600;box-shadow:0 2px 8px rgba(31,60,136,.2)}
        .settings-form{background:#fff;border-radius:14px;padding:32px;border:1px solid #e5e9f0;box-shadow:0 1px 3px rgba(0,0,0,.04)}
        .settings-section-title{font-size:1.15rem;font-weight:700;color:var(--text-dark);margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #e5e9f0}
        .settings-img-field{display:flex;gap:20px;align-items:flex-start}
        .settings-img-preview{width:200px;height:140px;border-radius:12px;overflow:hidden;border:2px dashed #d0d8e5;flex-shrink:0;background:#fafbfd}
        .settings-img-preview img{width:100%;height:100%;object-fit:contain}
        .settings-img-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-size:2rem;color:var(--text-light)}
        .settings-img-ph span{font-size:.75rem}
        .settings-img-actions{display:flex;flex-direction:column;gap:10px;align-items:flex-start;padding-top:8px}
        @media(max-width:800px){
          .settings-layout{grid-template-columns:1fr;gap:16px}
          .settings-sidebar{position:static;flex-direction:row;flex-wrap:wrap;gap:6px;padding:10px;overflow-x:auto;-webkit-overflow-scrolling:touch}
          .settings-nav-btn{padding:8px 14px;font-size:.78rem;white-space:nowrap;flex-shrink:0}
          .settings-form{padding:20px}
          .settings-section-title{font-size:1rem;margin-bottom:18px;padding-bottom:12px}
          .settings-img-field{flex-wrap:wrap}
          .settings-img-preview{width:100%;height:120px}
        }
        @media(max-width:480px){
          .settings-form{padding:14px}
          .settings-nav-btn{padding:7px 10px;font-size:.72rem}
          .settings-img-preview{height:100px}
        }
      `}</style>
    </div>
  );
}
