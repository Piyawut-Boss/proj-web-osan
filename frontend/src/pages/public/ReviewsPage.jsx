import { useState, useEffect } from 'react';
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
    api.get('/reviews').then(res => setReviews(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
            <div className="grid-3">
              {(reviews.length > 0 ? reviews : Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: 'หัวข้อ', description: 'รายละเอียด', image: null }))).map(item => (
                <div key={item.id} className="card">
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    {item.image ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div className="img-placeholder" style={{ height: '100%', fontSize: '3rem' }}>⭐</div>}
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ color: '#f39c12', marginBottom: 8 }}>★★★★★</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-medium)', lineHeight: 1.6 }}>{item.description}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 8 }}>PSU AGRO FOOD</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default ReviewsPage;
