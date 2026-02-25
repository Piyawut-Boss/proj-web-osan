import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import './HomePage.css';

const BASE_URL = "http://localhost:5000"; // 🔥 เปลี่ยนเป็น domain จริงตอน deploy

export default function HomePage() {
  const { get, getLines } = useSettings();
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [idx, setIdx] = useState(0);
  const [acc, setAcc] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data.data || [])).catch(() => {});
    api.get('/banners').then(r => setBanners(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => setIdx(i => (i + 1) % banners.length), 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  // Get product name in current language
  const getProductName = (product) => {
    const nameMap = {
      'th': product.name,
      'en': product.name_en || product.name,
      'zh': product.name_zh || product.name_en || product.name,
      'ms': product.name_ms || product.name_en || product.name,
      'ar': product.name_ar || product.name_en || product.name,
    };
    return nameMap[lang] || product.name;
  };

  const phone = get('contact_phone', '062-163-9888').split(',')[0].trim();

  // 🔥 FIX PSU BLEN IMAGE (ใช้ path ตรงจาก backend)
  const psuBlen = [
    {
      image: `${BASE_URL}/uploads/products/PSUBLen/PSUBLen1.jpg`,
      name: 'PSU Blen 1'
    },
    {
      image: `${BASE_URL}/uploads/products/PSUBLen/PSUBLen2.jpg`,
      name: 'PSU Blen 2'
    },
    {
      image: `${BASE_URL}/uploads/products/PSUBLen/PSUBLen3.jpg`,
      name: 'PSU Blen 3'
    }
  ];

  const catLabel = c => ({ psu_blen: 'PSU Blen', meal_box: 'Meal Box', oem: 'OEM' })[c] || c;

  const accItems = [
    { title: t('accordion_item1_title'), body: t('accordion_item1_body') },
    { title: t('accordion_item2_title'), body: t('accordion_item2_body') },
    { title: t('accordion_item3_title'), body: t('accordion_item3_body') },
  ];

  const heroBg = banners.length > 0 && banners[idx]?.image
    ? banners[idx].image
    : get('hero_banner_image') || '/hero-banner.png';

  return (
    <PublicLayout fullWidthHero>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hp-hero">
        <img
          src={heroBg}
          alt="PSU AGRO FOOD"
          className="hp-hero-full-img"
          onError={e => { e.target.style.display = 'none'; }}
        />
        {banners.length > 1 && (
          <div className="hp-dots">
            {banners.map((_, i) => (
              <button
                key={i}
                className={`hp-dot${i === idx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── PSU BLEN ─────────────────────────────────────────────────── */}
      <section className="hp-showcase">
        <div className="container hp-showcase-grid">
          <div className="hp-sc-info">
            <h2 className="hp-sc-title">
              {getLines('showcase_title','PSU Blen อาหารปั่นเหลวพร้อมทาน\nสูตรผสมเนื้อไก่').map((l, i) => (
                <span key={i}>{l}<br /></span>
              ))}
            </h2>
            <div className="hp-sc-btns">
              <a href="https://facebook.com/PSUBlen.official" target="_blank" rel="noreferrer" className="hp-sc-btn hp-sc-fb">{t('home_buy_facebook')}</a>
              <a href="https://line.me" target="_blank" rel="noreferrer" className="hp-sc-btn hp-sc-line">{t('home_buy_line')}</a>
              <a href={`tel:${phone.replace(/-/g,'')}`} className="hp-sc-btn hp-sc-tel">{t('tel')} : {phone}</a>
            </div>
          </div>

          <div className="hp-sc-imgs">
            <div className="hp-sc-main">
              {psuBlen[0]?.image
                ? <img src={psuBlen[0].image} alt={psuBlen[0].name} />
                : <div className="hp-img-ph">🥛</div>}
            </div>

            <div className="hp-sc-side">
              {[psuBlen[1], psuBlen[2]].map((p, i) => (
                <div key={i} className="hp-sc-small">
                  {p?.image
                    ? <img src={p.image} alt={p.name} />
                    : <div className="hp-img-ph sm">🥛</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MEAL BOX ─────────────────────────────────────────────────── */}
      <section className="hp-mealbox">
        <div className="container hp-mb-grid">
          <div className="hp-mb-left">
            <img
              src={`${BASE_URL}/uploads/products/MealBox/MealBox.png`}
              alt="meal box"
              className="hp-mb-img"
            />
          </div>

          <div className="hp-mb-right">
            <div className="hp-mb-brand">
              ᴾˢᵁ AGRO FOOD<br/>
              <small>PSU AGRO FOOD CO., LTD.</small>
            </div>
            <h2 className="hp-mb-title">{get('mealbox_title','อาหารกล่องพร้อมทาน')}</h2>
            <p className="hp-mb-en">{get('mealbox_subtitle','Ready-to-Eat Meal Box')}</p>
            <div className="hp-mb-desc">
              <p>{get('mealbox_line1','อร่อย สะดวก ปลอดภัย')}</p>
              <p>{get('mealbox_line2','Delicious · Convenient · Safe')}</p>
              <p>{get('mealbox_line3','Certified Quality (Thai FDA & Halal)')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCORDION ────────────────────────────────────────────────── */}
      <section className="hp-why">
        <div className="container">
          <h2 className="section-title hp-why-title">{t('accordion_section_title')}</h2>
          <div className="hp-accordion">
            {accItems.map((item, i) => (
              <div
                key={i}
                className={`hp-acc-item${acc === i ? ' open' : ''}`}
                onClick={() => setAcc(acc === i ? -1 : i)}
              >
                <div className="hp-acc-head">
                  <span>{item.title}</span>
                  <span className="hp-acc-arr">▾</span>
                </div>
                <div className="hp-acc-body">
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}