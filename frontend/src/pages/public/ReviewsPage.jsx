import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

const ReviewsPage = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    api.get('reviews').then(res => {
      console.log('Fetched reviews:', res.data.data);
      setReviews(res.data.data || []);
    }).catch(err => {
      console.error('Error fetching reviews:', err);
    }).finally(() => setLoading(false));
  }, []);

  const fmtDate = d => d ? new Date(d).toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'}) : '';

  return (
    <PublicLayout>
      <section style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', padding: '80px 0 60px', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 12 }}>{t('reviews_title')}</h1>
          <p style={{ opacity: 0.8 }}>{t('reviews_subtitle')}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {loading ? <div className="loading-spinner"><div className="spinner" /></div> : (
            <>
              {reviews.length === 0 && <p style={{textAlign:'center',color:'var(--text-light)',padding:'40px 0'}}>No reviews available</p>}
              <div className="grid-3">
                {reviews.map(item => (
                  <Link key={item.id} to={`/reviews/${item.id}`} style={{textDecoration:'none',display:'block'}}>
                    <div style={{ background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'var(--shadow-sm)', transition:'all 0.3s', cursor:'pointer' }} className="review-card-item">
                      <div style={{ height: 200, overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
                        {item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition:'transform 0.4s' }} />
                          : <div style={{ height: '100%', fontSize: '3rem', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f4ff' }}>⭐</div>}
                      </div>
                      <div style={{ padding: 20 }}>
                        <div style={{ color: '#f39c12', marginBottom: 8 }}>★★★★★</div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-dark)' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: 1.6 }}>{item.description}</p>
                        {item.published_date && <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 8 }}>{fmtDate(item.published_date)}</p>}
                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: 8 }}>PSU AGRO FOOD</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <style>{`
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .review-card-item:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.12); }
        .review-card-item:hover img { transform: scale(1.05); }
        @media (max-width: 700px) { .grid-3 { grid-template-columns: 1fr; } }
      `}</style>
    </PublicLayout>
  );
};

export default ReviewsPage;
