import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/LanguageContext';
import api, { getImageUrl } from '../../utils/api';
import './ProductsPage.css';

export default function ProductsPage() {
  const { get, getLines } = useSettings();
  const { t, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => { api.get('products').then(r => setProducts(r.data.data || [])).catch(() => {}); }, []);

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

  const cats = [
    { key:'all', label: t('products_all') },
    { key:'psu_blen', label: t('products_category_psu_blen') },
    { key:'meal_box', label: t('products_category_meal_box') },
    { key:'oem', label: t('products_category_oem') },
  ];

  const filtered = products.filter(p => {
    const matchCat = cat === 'all' || p.category === cat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.name_en||'').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PublicLayout>

      {/* HERO BANNER */}
      <section className="pp-hero">
        <div className="pp-hero-overlay"/>
        <div className="container pp-hero-body">
          <h1>{t('home_hero_title') || 'นวัตกรรมอาหารจากมหาวิทยาลัยสงขลานครินทร์'}</h1>
          <p>{t('home_hero_tagline') || 'สร้างคุณภาพชีวิตของทุกคนที่ดีกว่า'}</p>
          <div className="pp-hero-cats">
            <div className="pp-hero-cat">{get('showcase_image') ? <img src={getImageUrl(get('showcase_image'))} alt="PSU Blen" style={{height:'32px',width:'auto',objectFit:'contain'}} /> : '🥛'} {t('products_psu_blen_desc') || 'อาหารปั่นเหลวพร้อมทาน'}</div>
            <div className="pp-hero-cat">{get('mealbox_image') ? <img src={getImageUrl(get('mealbox_image'))} alt="Meal Box" style={{height:'32px',width:'auto',objectFit:'contain'}} /> : '🍱'} {t('products_meal_box_label') || 'อาหารกล่องพร้อมทาน'}</div>
            <div className="pp-hero-cat">🏭 {t('products_oem_label') || 'บริการ OEM สินค้าครบวงจร'}</div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER + SEARCH */}
      <section className="section">
        <div className="container">
          <div className="pp-filter-row">
            <div className="pp-cats">
              {cats.map(c => (
                <button key={c.key} className={`pp-cat-btn${cat===c.key?' active':''}`} onClick={() => setCat(c.key)}>{c.label}</button>
              ))}
            </div>
            <div className="pp-search">
              <input className="form-control" placeholder={t('products_search') || '🔍 ค้นหาสินค้า...'} value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
          </div>

          <h2 className="section-title" style={{textAlign:'left',marginTop:40}}>{t('home_our_products') || 'สินค้าและบริการของเรา'}</h2>

          {/* PSU BLEN GROUP */}
          {(cat==='all' || cat==='psu_blen') && (
            <div className="pp-group">
              <div className="pp-group-header">
                <div className="pp-group-icon">{get('showcase_image') ? <img src={getImageUrl(get('showcase_image'))} alt="PSU Blen"/> : '🥛'}</div>
                <div>
                  <h3>{t('products_psu_blen_title') || 'PSU Blen'} <span>{t('products_psu_blen_label') || 'พีเอสยู เบลน'}</span></h3>
                  <p>{t('products_psu_blen_desc') || 'อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่'}<br/>{t('products_psu_blen_en') || 'Blenderized Diet Chicken Protein'}</p>
                </div>
              </div>
              <div className="pp-product-list">
                {filtered.filter(p=>p.category==='psu_blen').map(p => (
                  <Link key={p.id} to={`/products/${p.id}`} className="pp-product-row">
                    <div className="pp-prod-img">{p.image ? <img src={getImageUrl(p.image)} alt={getProductName(p)}/> : <div className="pp-img-ph">🥛</div>}</div>
                    <div className="pp-prod-info">
                      <h4>{getProductName(p)}</h4>
                      {p.name_en && <p className="pp-prod-en">{p.name_en}</p>}
                      <div className="pp-prod-tags">
                        {p.weight && <span className="pp-tag">⚖️ {p.weight}</span>}
                        <span className="pp-tag badge-primary">PSU Blen</span>
                      </div>
                      {p.description && <p className="pp-prod-desc">{p.description}</p>}
                      {p.ingredients && <p className="pp-prod-ing"><strong>{t('products_ingredients') || 'Main Ingredients:'}</strong> {p.ingredients}</p>}
                    </div>
                    <div className="pp-prod-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* MEAL BOX GROUP */}
          {(cat==='all' || cat==='meal_box') && (
            <div className="pp-group">
              <div className="pp-group-header pp-mb-header">
                <div className="pp-group-icon">{get('mealbox_image') ? <img src={getImageUrl(get('mealbox_image'))} alt="Meal Box"/> : '🍱'}</div>
                <div>
                  <h3>{t('products_meal_box_title') || 'Crab Agro'} <span>{t('products_meal_box_label') || 'อาหารกล่องพร้อมทาน'}</span></h3>
                  <p>{t('products_meal_box_desc') || 'อร่อย สะดวก เก็บรักษานาน 18 เดือนที่อุณหภูมิห้อง'}<br/>{t('products_meal_box_en') || 'Delicious, Convenient and 18 months shelf life at room temperature.'}</p>
                </div>
              </div>
              <div className="pp-product-list">
                {filtered.filter(p=>p.category==='meal_box').map(p => (
                  <Link key={p.id} to={`/products/${p.id}`} className="pp-product-row">
                    <div className="pp-prod-img">{p.image ? <img src={getImageUrl(p.image)} alt={getProductName(p)}/> : <div className="pp-img-ph">🍱</div>}</div>
                    <div className="pp-prod-info">
                      <h4>{getProductName(p)}</h4>
                      {p.name_en && <p className="pp-prod-en">{p.name_en}</p>}
                      <div className="pp-prod-tags">
                        {p.weight && <span className="pp-tag">⚖️ {p.weight}</span>}
                        <span className="pp-tag badge-secondary">Meal Box</span>
                      </div>
                      {p.ingredients && <p className="pp-prod-ing"><strong>{t('products_ingredients') || 'Main Ingredients:'}</strong> {p.ingredients}</p>}
                    </div>
                    <div className="pp-prod-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* OEM GROUP */}
          {(cat==='all' || cat==='oem') && (
            <div className="pp-group pp-oem-group">
              <div className="pp-oem-inner">
                <div className="pp-oem-left">
                  {get('oem_image')
                    ? <img src={getImageUrl(get('oem_image'))} alt="OEM" className="pp-oem-img"/>
                    : <div className="pp-img-ph lg">🏭</div>}
                </div>
                <div className="pp-oem-right">
                  <div className="pp-oem-logo-row">
                    <span className="badge badge-primary">OEM</span>
                    <span style={{fontSize:'.75rem',color:'var(--text-light)',marginLeft:8}}>PSU AGRO FOOD CO., LTD.</span>
                  </div>
                  <h3>{get('oem_section_title','บริการ OEM รับผลิตอาหารและเครื่องดื่มครบวงจร')}</h3>
                  <p>{get('oem_description','เราให้บริการ OEM รับผลิตอาหาร, ซอส, เครื่องปรุง และเครื่องดื่ม ครบวงจร')}</p>
                  <div className="pp-oem-steps">
                    <h4>{t('oem_title')}</h4>
                    {[
                      t('oem_step1'),
                      t('oem_step2'),
                      t('oem_step3'),
                      t('oem_step4'),
                      t('oem_step5'),
                    ].map((s,i) => <p key={i} className="pp-oem-step">{s}</p>)}
                  </div>
                  <div className="pp-oem-contact">
                    <a href="https://line.me" target="_blank" rel="noreferrer" className="btn btn-primary">{t('products_oem_contact') || 'ติดต่อสอบถาม Line'}</a>
                    <div style={{marginTop:'15px', fontSize:'0.95rem', lineHeight:'1.8'}}>
                      <p><strong>เบอร์ติดต่อ</strong>      097-125-8615</p>
                      <p><strong>Email</strong>            psuagrofood.factory@gmail.com</p>
                    </div>
                    <p className="pp-oem-tagline">"{get('oem_tagline','เรามีทีมงาน วิจัยและพัฒนา สูตรผลิตภัณฑ์ตามที่ต้องการ')}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-light)'}}>
              <p style={{fontSize:'3rem'}}>🔍</p>
              <p>{t('products_notfound') || 'ไม่พบสินค้าที่ค้นหา'}</p>
            </div>
          )}
        </div>
      </section>

    </PublicLayout>
  );
}
