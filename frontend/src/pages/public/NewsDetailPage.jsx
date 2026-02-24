import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [news, setNews] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => { api.get(`/news/${id}`).then(r => setNews(r.data.data)).catch(()=>{}); }, [id]);
  const fmtDate = d => d ? new Date(d).toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}) : '';
  if (!news) return <PublicLayout><div className="container" style={{padding:'80px 0'}}>{t('products_detail_loading')}</div></PublicLayout>;
  return (
    <PublicLayout>
      <section className="section">
        <div className="container" style={{maxWidth:800}}>
          <Link to="/news" style={{color:'var(--primary)',fontSize:'.85rem',textDecoration:'none'}}>{t('news_back')}</Link>
          {news.created_at && <p style={{fontSize:'.82rem',color:'var(--text-light)',margin:'16px 0 8px'}}>{fmtDate(news.created_at)}</p>}
          <h1 style={{fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:800,color:'var(--text-dark)',lineHeight:1.4,marginBottom:24}}>{news.title}</h1>
          {news.image && <img src={news.image} alt={news.title} style={{width:'100%',borderRadius:12,marginBottom:28,maxHeight:400,objectFit:'cover'}}/>}
          {news.description && <p style={{fontSize:'1rem',color:'var(--text-medium)',lineHeight:1.8,marginBottom:20,fontWeight:500}}>{news.description}</p>}
          {news.content && <div style={{fontSize:'.95rem',color:'var(--text-medium)',lineHeight:1.85}} dangerouslySetInnerHTML={{__html:news.content.replace(/\n/g,'<br/>')}}/>}
        </div>
      </section>
    </PublicLayout>
  );
}
