import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function NewsPage() {
  const { t } = useLanguage();
  const [news, setNews] = useState([]);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    api.get('news').then(r => setNews(r.data.data || [])).catch(()=>{});
    api.get('reviews').then(r => setReviews(r.data.data || [])).catch(()=>{});
  }, []);
  const fmtDate = d => d ? new Date(d).toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}) : '';
  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <h1 className="section-title">{t('news_title')}</h1>
          {news.length === 0
            ? <p style={{textAlign:'center',color:'var(--text-light)',padding:'40px 0'}}>{t('news_empty')}</p>
            : <div className="news-grid">
                {news.map(n => (
                  <Link key={n.id} to={`/news/${n.id}`} className="news-card card">
                    <div className="news-img">{n.image ? <img src={n.image} alt={n.title}/> : <div className="news-ph">📰</div>}</div>
                    <div className="news-body">
                      {n.created_at && <p className="news-date">{fmtDate(n.created_at)}</p>}
                      <h3>{n.title}</h3>
                      {n.description && <p>{n.description.slice(0,100)}...</p>}
                    </div>
                  </Link>
                ))}
              </div>
          }
        </div>
      </section>
      <section className="section" style={{background:'#f8faff'}}>
        <div className="container">
          <h2 className="section-title">{t('news_reviews')}</h2>
          {reviews.length === 0
            ? <p style={{textAlign:'center',color:'var(--text-light)',padding:'40px 0'}}>{t('news_reviews_empty')}</p>
            : <div className="news-grid">
                {reviews.map(r => (
                  <div key={r.id} className="news-card card">
                    <div className="news-img">{r.image ? <img src={r.image} alt={r.title}/> : <div className="news-ph">⭐</div>}</div>
                    <div className="news-body">
                      <h3>{r.title}</h3>
                      {r.description && <p>{r.description}</p>}
                      <p className="news-source">PSU AGRO FOOD CO., LTD.</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </section>
      <style>{`
        .news-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .news-card{display:block;text-decoration:none;overflow:hidden}
        .news-img{height:180px;overflow:hidden;background:#f0f4ff}
        .news-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .news-card:hover .news-img img{transform:scale(1.05)}
        .news-ph{height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem}
        .news-body{padding:16px}
        .news-date{font-size:.78rem;color:var(--text-light);margin-bottom:8px}
        .news-body h3{font-size:.95rem;font-weight:700;color:var(--text-dark);margin-bottom:8px;line-height:1.4}
        .news-body p{font-size:.82rem;color:var(--text-medium);line-height:1.65}
        .news-source{font-size:.75rem;color:var(--secondary);font-weight:600;margin-top:8px}
        @media(max-width:700px){.news-grid{grid-template-columns:1fr}}
      `}</style>
    </PublicLayout>
  );
}
