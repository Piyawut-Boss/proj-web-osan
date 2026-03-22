import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function ReviewsDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [review, setReview] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => { api.get(`reviews/${id}`).then(r => setReview(r.data.data)).catch(()=>{}); }, [id]);
  const fmtDate = d => d ? new Date(d).toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}) : '';
  if (!review) return <PublicLayout><div className="container" style={{padding:'80px 0'}}>{t('products_detail_loading')}</div></PublicLayout>;
  return (
    <PublicLayout>
      <section className="section">
        <div className="container" style={{maxWidth:800}}>
          <Link to="/news" style={{color:'var(--primary)',fontSize:'.85rem',textDecoration:'none'}}>← {t('news_title')}</Link>
          {review.published_date && <p style={{fontSize:'.82rem',color:'var(--text-light)',margin:'16px 0 8px'}}>{fmtDate(review.published_date)}</p>}
          <h1 style={{fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:800,color:'var(--text-dark)',lineHeight:1.4,marginBottom:24}}>{review.title}</h1>
          {review.image && <img src={review.image} alt={review.title} style={{width:'100%',borderRadius:12,marginBottom:28,maxHeight:400,objectFit:'cover'}}/>}
          {review.description && <p style={{fontSize:'1rem',color:'var(--text-medium)',lineHeight:1.8,marginBottom:20,fontWeight:500}}>{review.description}</p>}
          {review.link_url && <a href={review.link_url} target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:8,color:'var(--primary)',textDecoration:'none',fontSize:'.95rem',fontWeight:600,marginTop:20,padding:'12px 16px',border:'1px solid var(--primary)',borderRadius:6,transition:'all .3s'}} onMouseEnter={e=>{e.currentTarget.style.background='var(--primary)'; e.currentTarget.style.color='white'}} onMouseLeave={e=>{e.currentTarget.style.color='var(--primary)'; e.currentTarget.style.background='transparent'}}>🔗 อ่านเพิ่มเติม</a>}
        </div>
      </section>
    </PublicLayout>
  );
}
