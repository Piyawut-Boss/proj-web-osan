import { useState, useEffect } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import api from '../../utils/api';
import './AdminPages.css';

const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = () => { setLoading(true); api.get(endpoint).then(r=>setData(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false)); };
  useEffect(()=>{fetch();},[]);
  const save = async (editing, form, imgFile, ep) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k,v]) => fd.append(k,v));
    if (imgFile) fd.append('image', imgFile);
    const url = ep||endpoint;
    if (editing) await api.put(`${url}/${editing.id}`,fd,{headers:{'Content-Type':'multipart/form-data'}});
    else await api.post(url,fd,{headers:{'Content-Type':'multipart/form-data'}});
    fetch();
  };
  const remove = async (id,ep) => { await api.delete(`${ep||endpoint}/${id}`); fetch(); };
  return {data,loading,save,remove,refetch:fetch};
};

const ImgField = ({preview,onChange}) => (
  <div className="form-group">
    <label className="form-label">รูปภาพ</label>
    <div className="image-upload-area">
      {preview ? <img src={preview} alt="preview" className="image-preview"/> : <div className="image-upload-placeholder"><p>คลิกเพื่ออัปโหลด</p></div>}
      <input type="file" accept="image/*" onChange={onChange} className="image-input"/>
    </div>
  </div>
);

const ModalActions = ({onClose,saving}) => (
  <div className="modal-actions">
    <button type="button" className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
    <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'กำลังบันทึก...':'บันทึก'}</button>
  </div>
);

// ── REVIEWS ──────────────────────────────────────────────────────────────────
export const AdminReviews = () => {
  const {data,loading,save,remove,refetch} = useCRUD('reviews/admin/all');
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({title:'',description:'',published_date:'',link_url:''});
  const [imgFile,setImgFile]=useState(null);
  const [imgPrev,setImgPrev]=useState(null);
  const [saving,setSaving]=useState(false);
  const [alert,setAlert]=useState(null);
  const showAlert=(m,t='success')=>{setAlert({m,t});setTimeout(()=>setAlert(null),3000)};
  const openCreate=()=>{setEditing(null);setForm({title:'',description:'',published_date:new Date().toISOString().split('T')[0],link_url:''});setImgFile(null);setImgPrev(null);setOpen(true)};
  const openEdit=r=>{setEditing(r);setForm({title:r.title||'',description:r.description||'',published_date:r.published_date||'',link_url:r.link_url||''});setImgPrev(r.image||null);setImgFile(null);setOpen(true)};
  const submit=async e=>{e.preventDefault();setSaving(true);try{await save(editing,form,imgFile,'reviews');showAlert(editing?'อัปเดตสำเร็จ':'เพิ่มสำเร็จ');setOpen(false)}catch{showAlert('เกิดข้อผิดพลาด','error')}finally{setSaving(false)}};
  const del=async id=>{try{await remove(id,'reviews');showAlert('ลบสำเร็จ')}catch{showAlert('เกิดข้อผิดพลาด','error')}};
  const cols=[
    {key:'image',label:'รูป',render:v=>v?<img src={v} alt=""/>:<span style={{color:'var(--text-light)',fontSize:'.8rem'}}>ไม่มีรูป</span>},
    {key:'title',label:'หัวข้อ'},
    {key:'published_date',label:'วันที่',render:v=>v?new Date(v).toLocaleDateString('th-TH'):'—'},
    {key:'description',label:'รายละเอียด',render:v=>v?v.slice(0,50)+'...':'—'},
  ];
  return (
    <div className="admin-page">
      <div className="page-header"><div><h1>จัดการรีวิว</h1></div><button className="btn btn-primary" onClick={openCreate}>เพิ่มรีวิว</button></div>
      {alert&&<div className={`alert alert-${alert.t}`}>{alert.m}</div>}
      <div className="page-content"><AdminTable columns={cols} data={data} onEdit={openEdit} onDelete={del} loading={loading}/></div>
      <AdminModal isOpen={open} onClose={()=>setOpen(false)} title={editing?'แก้ไขรีวิว':'เพิ่มรีวิวใหม่'}>
        <form onSubmit={submit}>
          <ImgField preview={imgPrev} onChange={e=>{const f=e.target.files[0];if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f))}}}/>
          <div className="form-group"><label className="form-label">หัวข้อ *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">รายละเอียด</label><textarea className="form-control" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">วันที่เผยแพร่</label><input type="date" className="form-control" value={form.published_date} onChange={e=>setForm({...form,published_date:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">ลิงค์</label><input type="url" className="form-control" value={form.link_url} onChange={e=>setForm({...form,link_url:e.target.value})} placeholder="https://..."/></div>
          </div>
          <ModalActions onClose={()=>setOpen(false)} saving={saving}/>
        </form>
      </AdminModal>
    </div>
  );
};

// ── NEWS ───────────────────────────────────────────────────────────────────────
export const AdminNews = () => {
  const {data,loading,save,remove,refetch} = useCRUD('news/admin/all');
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({title:'',description:'',content:'',published_date:'',link_url:'',is_published:'true'});
  const [imgFile,setImgFile]=useState(null);
  const [imgPrev,setImgPrev]=useState(null);
  const [saving,setSaving]=useState(false);
  const [alert,setAlert]=useState(null);
  const showAlert=(m,t='success')=>{setAlert({m,t});setTimeout(()=>setAlert(null),3000)};
  const openCreate=()=>{setEditing(null);setForm({title:'',description:'',content:'',published_date:new Date().toISOString().split('T')[0],link_url:'',is_published:'true'});setImgFile(null);setImgPrev(null);setOpen(true)};
  const openEdit=r=>{setEditing(r);setForm({title:r.title||'',description:r.description||'',content:r.content||'',published_date:r.published_date||'',link_url:r.link_url||'',is_published:String(r.is_published??true)});setImgPrev(r.image||null);setImgFile(null);setOpen(true)};
  const submit=async e=>{e.preventDefault();setSaving(true);try{await save(editing,form,imgFile,'news');showAlert(editing?'อัปเดตสำเร็จ':'เพิ่มสำเร็จ');setOpen(false)}catch{showAlert('เกิดข้อผิดพลาด','error')}finally{setSaving(false)}};
  const del=async id=>{try{await remove(id,'news');showAlert('ลบสำเร็จ')}catch{showAlert('เกิดข้อผิดพลาด','error')}};
  const cols=[
    {key:'image',label:'รูป',render:v=>v?<img src={v} alt=""/>:<span style={{color:'var(--text-light)',fontSize:'.8rem'}}>ไม่มีรูป</span>},
    {key:'title',label:'หัวข้อ'},
    {key:'published_date',label:'วันที่',render:v=>v?new Date(v).toLocaleDateString('th-TH'):'—'},
    {key:'is_published',label:'สถานะ',render:v=><span className={`badge ${v?'badge-accent':'badge-primary'}`}>{v?'เผยแพร่':'ร่าง'}</span>},
  ];
  return (
    <div className="admin-page">
      <div className="page-header"><div><h1>จัดการข่าวสาร</h1></div><button className="btn btn-primary" onClick={openCreate}>เพิ่มข่าวสาร</button></div>
      {alert&&<div className={`alert alert-${alert.t}`}>{alert.m}</div>}
      <div className="page-content"><AdminTable columns={cols} data={data} onEdit={openEdit} onDelete={del} loading={loading}/></div>
      <AdminModal isOpen={open} onClose={()=>setOpen(false)} title={editing?'แก้ไขข่าวสาร':'เพิ่มข่าวสารใหม่'} size="lg">
        <form onSubmit={submit}>
          <ImgField preview={imgPrev} onChange={e=>{const f=e.target.files[0];if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f))}}}/>
          <div className="form-group"><label className="form-label">หัวข้อ *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">คำบรรยาย (หัวข้อย่อย)</label><input className="form-control" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">เนื้อหา</label><textarea className="form-control" rows={5} value={form.content} onChange={e=>setForm({...form,content:e.target.value})}/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">วันที่เผยแพร่</label><input type="date" className="form-control" value={form.published_date} onChange={e=>setForm({...form,published_date:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">ลิงค์</label><input type="url" className="form-control" value={form.link_url} onChange={e=>setForm({...form,link_url:e.target.value})} placeholder="https://..."/></div>
          </div>
          <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}><input type="checkbox" checked={form.is_published==='true'||form.is_published===true} onChange={e=>setForm({...form,is_published:String(e.target.checked)})}/><span className="form-label" style={{margin:0}}>เผยแพร่</span></label></div>
          <ModalActions onClose={()=>setOpen(false)} saving={saving}/>
        </form>
      </AdminModal>
    </div>
  );
};

// ── CERTIFICATES ──────────────────────────────────────────────────────────────
export const AdminCertificates = () => {
  const {data,loading,save,remove} = useCRUD('certificates');
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({title:'',sort_order:'0'});
  const [imgFile,setImgFile]=useState(null);
  const [imgPrev,setImgPrev]=useState(null);
  const [saving,setSaving]=useState(false);
  const [alert,setAlert]=useState(null);
  const showAlert=(m,t='success')=>{setAlert({m,t});setTimeout(()=>setAlert(null),3000)};
  const openCreate=()=>{setEditing(null);setForm({title:'',sort_order:'0'});setImgFile(null);setImgPrev(null);setOpen(true)};
  const openEdit=r=>{setEditing(r);setForm({title:r.title||'',sort_order:String(r.sort_order||0)});setImgPrev(r.image||null);setImgFile(null);setOpen(true)};
  const submit=async e=>{e.preventDefault();setSaving(true);try{await save(editing,form,imgFile,'certificates');showAlert(editing?'อัปเดตสำเร็จ':'เพิ่มสำเร็จ');setOpen(false)}catch{showAlert('เกิดข้อผิดพลาด','error')}finally{setSaving(false)}};
  const del=async id=>{try{await remove(id,'certificates');showAlert('ลบสำเร็จ')}catch{showAlert('เกิดข้อผิดพลาด','error')}};
  const cols=[
    {key:'image',label:'รูป',render:v=>v?<img src={v} alt="" style={{height:60,width:'auto'}}/>:<span style={{color:'var(--text-light)',fontSize:'.8rem'}}>ไม่มีรูป</span>},
    {key:'title',label:'ชื่อใบรับรอง'},
    {key:'sort_order',label:'ลำดับ'},
  ];
  return (
    <div className="admin-page">
      <div className="page-header"><div><h1>จัดการใบรับรองมาตรฐาน</h1></div><button className="btn btn-primary" onClick={openCreate}>เพิ่มใบรับรอง</button></div>
      {alert&&<div className={`alert alert-${alert.t}`}>{alert.m}</div>}
      <div className="page-content"><AdminTable columns={cols} data={data} onEdit={openEdit} onDelete={del} loading={loading}/></div>
      <AdminModal isOpen={open} onClose={()=>setOpen(false)} title={editing?'แก้ไขใบรับรอง':'เพิ่มใบรับรองใหม่'}>
        <form onSubmit={submit}>
          <ImgField preview={imgPrev} onChange={e=>{const f=e.target.files[0];if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f))}}}/>
          <div className="form-group"><label className="form-label">ชื่อใบรับรอง *</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">ลำดับ</label><input className="form-control" type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></div>
          <ModalActions onClose={()=>setOpen(false)} saving={saving}/>
        </form>
      </AdminModal>
    </div>
  );
};

// ── BANNERS ────────────────────────────────────────────────────────────────────
export const AdminBanners = () => {
  const {data,loading,remove,refetch} = useCRUD('banners/admin/all');
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({title:'',subtitle:'',link_url:'',sort_order:'0',is_active:'true'});
  const [imgFile,setImgFile]=useState(null);
  const [imgPrev,setImgPrev]=useState(null);
  const [saving,setSaving]=useState(false);
  const [alert,setAlert]=useState(null);
  const showAlert=(m,t='success')=>{setAlert({m,t});setTimeout(()=>setAlert(null),3000)};
  const openCreate=()=>{setEditing(null);setForm({title:'',subtitle:'',link_url:'',sort_order:'0',is_active:'true'});setImgFile(null);setImgPrev(null);setOpen(true)};
  const openEdit=r=>{setEditing(r);setForm({title:r.title||'',subtitle:r.subtitle||'',link_url:r.link_url||'',sort_order:String(r.sort_order||0),is_active:String(r.is_active??true)});setImgPrev(r.image||null);setImgFile(null);setOpen(true)};
  const submit=async e=>{
    e.preventDefault();setSaving(true);
    try{
      const fd=new FormData();
      Object.entries(form).forEach(([k,v])=>fd.append(k,v));
      if(imgFile)fd.append('image',imgFile);
      if(editing) await api.put(`/banners/${editing.id}`,fd,{headers:{'Content-Type':'multipart/form-data'}});
      else await api.post('banners',fd,{headers:{'Content-Type':'multipart/form-data'}});
      showAlert(editing?'อัปเดตสำเร็จ':'เพิ่มสำเร็จ');setOpen(false);refetch();
    }catch{showAlert('เกิดข้อผิดพลาด','error')}finally{setSaving(false)}
  };
  const del=async id=>{try{await api.delete(`/banners/${id}`);showAlert('ลบสำเร็จ');refetch()}catch{showAlert('เกิดข้อผิดพลาด','error')}};
  const cols=[
    {key:'image',label:'รูป',render:v=>v?<img src={v} alt="" style={{height:50,width:90,objectFit:'cover',borderRadius:6}}/>:<span style={{color:'var(--text-light)',fontSize:'.8rem'}}>ไม่มีรูป</span>},
    {key:'title',label:'หัวข้อ',render:v=>v||'—'},
    {key:'sort_order',label:'ลำดับ'},
    {key:'is_active',label:'สถานะ',render:v=><span className={`badge ${v?'badge-accent':'badge-primary'}`}>{v?'เผยแพร่':'ซ่อน'}</span>},
  ];
  return (
    <div className="admin-page">
      <div className="page-header"><div><h1>จัดการแบนเนอร์</h1></div><button className="btn btn-primary" onClick={openCreate}>เพิ่มแบนเนอร์</button></div>
      {alert&&<div className={`alert alert-${alert.t}`}>{alert.m}</div>}
      <div className="page-content"><AdminTable columns={cols} data={data} onEdit={openEdit} onDelete={del} loading={loading}/></div>
      <AdminModal isOpen={open} onClose={()=>setOpen(false)} title={editing?'แก้ไขแบนเนอร์':'เพิ่มแบนเนอร์ใหม่'}>
        <form onSubmit={submit}>
          <div className="form-group"><label className="form-label">รูปแบนเนอร์</label>
            <div className="image-upload-area" style={{height:180}}>
              {imgPrev?<img src={imgPrev} alt="preview" className="image-preview"/>:<div className="image-upload-placeholder"><p>คลิกเพื่ออัปโหลด (แนะนำ 1920×600)</p></div>}
              <input type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f))}}} className="image-input"/>
            </div>
          </div>
          <div className="form-group"><label className="form-label">หัวข้อ</label><input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">คำบรรยาย</label><textarea className="form-control" rows={2} value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})}/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Link URL</label><input className="form-control" value={form.link_url} onChange={e=>setForm({...form,link_url:e.target.value})} placeholder="https://..."/></div>
            <div className="form-group"><label className="form-label">ลำดับ</label><input className="form-control" type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></div>
          </div>
          <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}><input type="checkbox" checked={form.is_active==='true'||form.is_active===true} onChange={e=>setForm({...form,is_active:String(e.target.checked)})}/><span className="form-label" style={{margin:0}}>เผยแพร่</span></label></div>
          <ModalActions onClose={()=>setOpen(false)} saving={saving}/>
        </form>
      </AdminModal>
    </div>
  );
};

// ── BOARD MEMBERS ────────────────────────────────────────────────────────────
export const AdminBoardMembers = () => {
  const {data,loading,save,remove} = useCRUD('board-members/admin/all');
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:'',position:'',board_type:'board',sort_order:'0'});
  const [imgFile,setImgFile]=useState(null);
  const [imgPrev,setImgPrev]=useState(null);
  const [saving,setSaving]=useState(false);
  const [alert,setAlert]=useState(null);
  const showAlert=(m,t='success')=>{setAlert({m,t});setTimeout(()=>setAlert(null),3000)};
  const openCreate=()=>{setEditing(null);setForm({name:'',position:'',board_type:'board',sort_order:'0'});setImgFile(null);setImgPrev(null);setOpen(true)};
  const openEdit=r=>{setEditing(r);setForm({name:r.name||'',position:r.position||'',board_type:r.board_type||'board',sort_order:String(r.sort_order||0)});setImgPrev(r.image||null);setImgFile(null);setOpen(true)};
  const submit=async e=>{e.preventDefault();setSaving(true);try{await save(editing,form,imgFile,'board-members');showAlert(editing?'อัปเดตสำเร็จ':'เพิ่มสำเร็จ');setOpen(false)}catch{showAlert('เกิดข้อผิดพลาด','error')}finally{setSaving(false)}};
  const del=async id=>{try{await remove(id,'board-members');showAlert('ลบสำเร็จ')}catch{showAlert('เกิดข้อผิดพลาด','error')}};
  const cols=[
    {key:'image',label:'รูป',render:v=>v?<img src={v} alt="" style={{height:60,width:'auto'}}/>:<span style={{color:'var(--text-light)',fontSize:'.8rem'}}>ไม่มีรูป</span>},
    {key:'name',label:'ชื่อ'},
    {key:'position',label:'ตำแหน่ง'},
    {key:'board_type',label:'ประเภท',render:v=>v==='board'?'บริษัท':'บริหาร'},
    {key:'sort_order',label:'ลำดับ'},
  ];
  return (
    <div className="admin-page">
      <div className="page-header"><div><h1>จัดการคณะกรรมการ</h1></div><button className="btn btn-primary" onClick={openCreate}>เพิ่มคณะกรรมการ</button></div>
      {alert&&<div className={`alert alert-${alert.t}`}>{alert.m}</div>}
      <div className="page-content"><AdminTable columns={cols} data={data} onEdit={openEdit} onDelete={del} loading={loading}/></div>
      <AdminModal isOpen={open} onClose={()=>setOpen(false)} title={editing?'แก้ไขคณะกรรมการ':'เพิ่มคณะกรรมการใหม่'}>
        <form onSubmit={submit}>
          <ImgField preview={imgPrev} onChange={e=>{const f=e.target.files[0];if(f){setImgFile(f);setImgPrev(URL.createObjectURL(f))}}}/>
          <div className="form-group"><label className="form-label">ชื่อ *</label><input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">ตำแหน่ง</label><input className="form-control" value={form.position} onChange={e=>setForm({...form,position:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">ประเภท</label><select className="form-control" value={form.board_type} onChange={e=>setForm({...form,board_type:e.target.value})}><option value="board">บริษัท (ขนาดใหญ่)</option><option value="management">บริหาร (ขนาดเล็ก)</option></select></div>
          <div className="form-group"><label className="form-label">ลำดับ</label><input type="number" className="form-control" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})}/></div>
          <ModalActions onClose={()=>setOpen(false)} saving={saving}/>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminNews;
