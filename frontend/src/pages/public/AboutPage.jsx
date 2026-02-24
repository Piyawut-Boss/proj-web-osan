import { useState, useEffect } from 'react';
import PublicLayout from '../../components/public/PublicLayout';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/LanguageContext';
import './AboutPage.css';

export default function AboutPage() {
  const { get, getLines } = useSettings();
  const { t } = useLanguage();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const missionItems = [1,2,3,4].map(i => ({
    icon: get(`mission_item${i}_icon`, ['👥','🌍','👷','📈'][i-1]),
    title: t(`mission_item${i}_title`),
    desc: get(`mission_item${i}_desc`, ''),
  }));

  const coreValues = [1,2,3,4].map(i => ({
    title: t(`core_value${i}_title`),
    image: get(`core_value${i}_image`, ''),
  }));

  const timelineItems = [1,2,3].map(i => ({
    year: t(`timeline_item${i}_year`),
    events: (t(`timeline_item${i}_events`) || '').split('\n').filter(e=>e.trim()),
    image: get(`timeline_item${i}_image`, ''),
  }));

  return (
    <PublicLayout>

      {/* ── VISION ─────────────────────────────────────────────────── */}
      <section className="ab-vision">
        <div className="container ab-vision-inner">
          <h2 className="ab-vision-title">{t('about_vision_title')}</h2>
          <p className="ab-vision-text">{get('vision_text','ผู้นำด้านการวิจัยและผลิตอาหารเพื่อสุขภาพด้วยนวัตกรรมที่เติบโตไปพร้อมกับสังคมที่ดี')}</p>
        </div>
      </section>

      {/* ── MISSION ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t('about_mission_title')}</h2>
          <div className="ab-mission-grid">
            {missionItems.map((item,i) => (
              <div key={i} className="ab-mission-card">
                <div className="ab-mission-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
            <div className="ab-mission-center">👥</div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ────────────────────────────────────────────── */}
      <section className="section ab-cv-section">
        <div className="container">
          <h2 className="section-title">{t('about_values_title')}</h2>
          <div className="ab-cv-grid">
            {coreValues.map((cv,i) => (
              <div key={i} className="ab-cv-card">
                {cv.image
                  ? <img src={cv.image} alt={cv.title} className="ab-cv-img"/>
                  : <div className="ab-cv-img-ph">🏭</div>
                }
                <p className="ab-cv-title">{cv.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t('about_timeline_title')}</h2>
          <div className="ab-timeline">
            {timelineItems.map((item,i) => (
              <div key={i} className={`ab-tl-row${i%2===0?'':' ab-tl-right'}`}>
                <div className="ab-tl-img-col">
                  {item.image
                    ? <img src={item.image} alt={item.year} className="ab-tl-img"/>
                    : <div className="ab-tl-img-ph">🏗️</div>
                  }
                </div>
                <div className="ab-tl-line-col"><div className="ab-tl-dot"/></div>
                <div className="ab-tl-content">
                  <h3 className="ab-tl-year">{item.year}</h3>
                  <ul className="ab-tl-events">
                    {item.events.filter(e=>e.trim()).map((ev,j) => <li key={j}>{ev.trim()}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER PHOTOS ──────────────────────────────────────────── */}
      {(get('partner_image1') || get('partner_image2') || get('partner_image3')) && (
        <section className="section" style={{paddingTop:0}}>
          <div className="container">
            <div className="ab-partners">
              {[1,2,3].map(i => get(`partner_image${i}`) && (
                <div key={i} className="ab-partner-img">
                  <img src={get(`partner_image${i}`)} alt={`partner ${i}`}/>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PSU AGRO FOOD TODAY TEXT ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">{t('about_today_title')}</h2>
          <div className="ab-today-text">
            {(t('about_today_content') || '').split('\n').filter(line => line.trim()).map((line,i) => <p key={i}>{line}</p>)}
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
