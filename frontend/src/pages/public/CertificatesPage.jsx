import { useState, useEffect } from 'react';
import PublicLayout from '../../components/public/PublicLayout';
import { useLanguage } from '../../context/LanguageContext';
import api, { getImageUrl } from '../../utils/api';

const STATIC_CERTS = [
  { id: 's1', title: 'หนังสือให้ใช้เครื่องหมายรับรองฮาลาล', image: '/cert-halal.png' },
  { id: 's2', title: 'ใบอนุญาตผลิตอาหาร', image: '/cert-food-license.png' },
  { id: 's3', title: 'ใบสำคัญการจดทะเบียนอาหาร', image: '/cert-food-reg.png' },
];

export default function CertificatesPage() {
  const { t } = useLanguage();
  const [certs, setCerts] = useState(STATIC_CERTS);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    api.get('/certificates')
      .then(r => {
        const data = r.data.data || [];
        if (data.length > 0) {
          // Merge API data with static images as fallback for missing images
          const mergedCerts = data.map((cert, idx) => ({
            ...cert,
            image: cert.image || STATIC_CERTS[idx]?.image // Use static image if API doesn't have one
          }));
          setCerts(mergedCerts);
        }
      })
      .catch(() => {
        // Keep static certificates if API fails
        setCerts(STATIC_CERTS);
      });
  }, []);

  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <h1 className="section-title">{t('cert_title')}</h1>

          {/* Stacked full-width certificates */}
          <div className="cert-list">
            {certs.map(c => (
              <div key={c.id} className="cert-item">
                {c.image
                  ? <img
                      src={getImageUrl(c.image)}
                      alt={c.title}
                      className="cert-img"
                      onClick={() => setLightbox(c)}
                    />
                  : <div className="cert-ph" onClick={() => setLightbox(c)}>📜</div>
                }
                <p className="cert-label">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="cert-lightbox" onClick={() => setLightbox(null)}>
          <div className="cert-lb-inner" onClick={e => e.stopPropagation()}>
            <button className="cert-lb-close" onClick={() => setLightbox(null)}>✕</button>
            {lightbox.image
              ? <img src={getImageUrl(lightbox.image)} alt={lightbox.title} />
              : <div className="cert-ph big">📜</div>
            }
            <p className="cert-lb-title">{lightbox.title}</p>
          </div>
        </div>
      )}

      <style>{`
        /* ── Stacked list ── */
        .cert-list {
          display: flex;
          flex-direction: column;
          gap: 48px;
          max-width: 780px;
          margin: 0 auto;
        }

        .cert-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cert-img {
          width: 100%;
          display: block;
          cursor: zoom-in;
          border-radius: 4px;
          transition: opacity 0.2s;
        }
        .cert-img:hover { opacity: 0.9; }

        .cert-ph {
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          background: #f0f4ff;
          border-radius: 4px;
          cursor: zoom-in;
        }
        .cert-ph.big { height: 500px; width: 100%; }

        .cert-label {
          margin-top: 14px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
          text-align: center;
        }

        /* ── Lightbox ── */
        .cert-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(10, 15, 40, 0.85);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
          animation: lb-in 0.2s ease;
        }
        @keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }

        .cert-lb-inner {
          background: #fff;
          border-radius: 16px;
          padding: 24px;
          max-width: 720px;
          width: 100%;
          text-align: center;
          position: relative;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.4);
          animation: lb-slide 0.22s ease;
        }
        @keyframes lb-slide {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .cert-lb-inner img {
          width: 100%;
          border-radius: 6px;
          margin-bottom: 14px;
        }

        .cert-lb-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary);
        }

        .cert-lb-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #f0f4ff;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          color: var(--text-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .cert-lb-close:hover { background: #dde4ff; }

        @media (max-width: 600px) {
          .cert-list { gap: 36px; }
          .cert-label { font-size: 0.9rem; }
        }
      `}</style>
    </PublicLayout>
  );
}
