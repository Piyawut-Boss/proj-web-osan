import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <h1 className="section-title">{t('news_title')}</h1>
          {news.length === 0
            ? <p style={{textAlign:'center',color:'var(--text-light)',padding:'40px 0'}}>{t('news_empty')}</p>
            : <div className="news-grid">
                {news.map(n => (
                  <div key={n.id} className="news-card card" onClick={() => navigate(`/news/${n.id}`)} style={{cursor:'pointer'}}>
                    <div className="news-img">{n.image ? <img src={n.image} alt={n.title}/> : <div className="news-ph">📰</div>}</div>
                    <div className="news-body">
                      {n.created_at && <p className="news-date">{fmtDate(n.created_at)}</p>}
                      <h3>{n.title}</h3>
                      {n.description && <p className="news-desc">{n.description.length > 200 ? n.description.slice(0,200) + '...' : n.description}</p>}
                      {n.link_url
                        ? <a href={n.link_url} target="_blank" rel="noopener noreferrer" className="news-readmore" onClick={e => e.stopPropagation()}>อ่านเพิ่มเติม →</a>
                        : <span className="news-readmore">อ่านเพิ่มเติม →</span>
                      }
                    </div>
                  </div>
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
                  <div key={r.id} className="news-card card" onClick={() => navigate(`/reviews/${r.id}`)} style={{cursor:'pointer'}}>
                    <div className="news-img">{r.image ? <img src={r.image} alt={r.title}/> : <div className="news-ph">⭐</div>}</div>
                    <div className="news-body">
                      <h3>{r.title}</h3>
                      {r.description && <p className="news-desc">{r.description.length > 200 ? r.description.slice(0,200) + '...' : r.description}</p>}
                      {r.link_url
                        ? <a href={r.link_url} target="_blank" rel="noopener noreferrer" className="news-readmore" onClick={e => e.stopPropagation()}>อ่านเพิ่มเติม →</a>
                        : <span className="news-readmore">อ่านเพิ่มเติม →</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      </section>
      <style>{`
        .news-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .news-card{display:block;text-decoration:none;overflow:hidden;transition:transform .3s,box-shadow .3s}
        .news-card:hover{transform:translateY(-4px);box-shadow:0 8px 24px rgba(0,0,0,.1)}
        .news-img{height:220px;overflow:hidden;background:#f0f4ff}
        .news-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .news-card:hover .news-img img{transform:scale(1.05)}
        .news-ph{height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem}
        .news-body{padding:20px}
        .news-date{font-size:.78rem;color:var(--text-light);margin-bottom:8px}
        .news-body h3{font-size:1.05rem;font-weight:700;color:var(--text-dark);margin-bottom:10px;line-height:1.4}
        .news-desc{font-size:.85rem;color:var(--text-medium);line-height:1.7;margin-bottom:12px}
        .news-body p{font-size:.82rem;color:var(--text-medium);line-height:1.65}
        .news-readmore{display:inline-block;font-size:.82rem;color:var(--primary);font-weight:600;margin-top:8px}
        .news-card:hover .news-readmore{text-decoration:underline}
        .news-source{font-size:.75rem;color:var(--secondary);font-weight:600;margin-top:8px}
        @media(max-width:700px){.news-grid{grid-template-columns:1fr}}
      `}</style>
    </PublicLayout>
  );
}
