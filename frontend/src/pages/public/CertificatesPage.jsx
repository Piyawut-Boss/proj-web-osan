import { useState, useEffect } from 'react';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function CertificatesPage() {
  const { t } = useLanguage();
  const [certs, setCerts] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => { api.get('/certificates').then(r => setCerts(r.data.data || [])).catch(()=>{}); }, []);
  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <h1 className="section-title">{t('cert_title')}</h1>
          <div className="cert-grid">
            {certs.map(c => (
              <div key={c.id} className="cert-card card" onClick={() => setLightbox(c)}>
                {c.image ? <img src={c.image} alt={c.title}/> : <div className="cert-ph">📜</div>}
                <p className="cert-title">{c.title}</p>
              </div>
            ))}
            {certs.length === 0 && <p style={{color:'var(--text-light)',gridColumn:'1/-1',textAlign:'center',padding:'60px 0'}}>{t('cert_empty')}</p>}
          </div>
        </div>
      </section>
      {lightbox && (
        <div className="cert-lightbox" onClick={() => setLightbox(null)}>
          <div className="cert-lb-inner" onClick={e => e.stopPropagation()}>
            <button className="cert-lb-close" onClick={() => setLightbox(null)}>✕</button>
            {lightbox.image ? <img src={lightbox.image} alt={lightbox.title}/> : <div className="cert-ph big">📜</div>}
            <p>{lightbox.title}</p>
          </div>
        </div>
      )}
      <style>{`
        .cert-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
        .cert-card{cursor:pointer;overflow:hidden;text-align:center;transition:transform .2s}
        .cert-card:hover{transform:translateY(-4px)}
        .cert-card img{width:100%;border-radius:8px;margin-bottom:12px;object-fit:contain;max-height:360px;background:#f8f8f8}
        .cert-ph{height:280px;display:flex;align-items:center;justify-content:center;font-size:5rem;background:#f0f4ff;border-radius:8px;margin-bottom:12px}
        .cert-ph.big{height:400px}
        .cert-title{font-size:.9rem;font-weight:600;color:var(--text-dark)}
        .cert-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
        .cert-lb-inner{background:#fff;border-radius:14px;padding:24px;max-width:640px;width:100%;text-align:center;position:relative;max-height:90vh;overflow:auto}
        .cert-lb-inner img{width:100%;border-radius:8px;margin-bottom:14px}
        .cert-lb-inner p{font-size:.95rem;font-weight:600;color:var(--text-dark)}
        .cert-lb-close{position:absolute;top:14px;right:14px;background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--text-medium)}
        @media(max-width:700px){.cert-grid{grid-template-columns:1fr}}
      `}</style>
    </PublicLayout>
  );
}
