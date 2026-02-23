import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../components/public/PublicLayout';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { get } = useSettings();
  const { t, lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  // Get product name in current language
  const getProductName = () => {
    if (!product) return '';
    const nameMap = {
      'th': product.name,
      'en': product.name_en || product.name,
      'zh': product.name_zh || product.name_en || product.name,
      'ms': product.name_ms || product.name_en || product.name,
      'ar': product.name_ar || product.name_en || product.name,
    };
    return nameMap[lang] || product.name;
  };

  // Get product description in current language
  const getProductDescription = () => {
    if (!product || !product.description) return '';
    const descMap = {
      'th': product.description,
      'en': product.description_en || product.description,
      'zh': product.description_zh || product.description_en || product.description,
      'ms': product.description_ms || product.description_en || product.description,
      'ar': product.description_ar || product.description_en || product.description,
    };
    return descMap[lang] || product.description;
  };
  const phone = get('contact_phone','062-163-9888').split(',')[0].trim();
  const catLabel = c => ({psu_blen:'PSU Blen',meal_box:'Meal Box',oem:'OEM'})[c] || c;

  if (loading) return <PublicLayout><div className="container" style={{padding:'80px 0',textAlign:'center'}}>{t('products_detail_loading') || 'กำลังโหลด...'}</div></PublicLayout>;
  if (!product) return <PublicLayout><div className="container" style={{padding:'80px 0',textAlign:'center'}}>{t('products_detail_notfound') || 'ไม่พบสินค้า'} <Link to="/products">{t('products_back') || '← กลับ'}</Link></div></PublicLayout>;

  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          {/* Breadcrumb */}
          <div className="pdp-breadcrumb">
            <Link to="/">{t('products_breadcrumb_home') || 'หน้าหลัก'}</Link> &rsaquo; <Link to="/products">{t('products_breadcrumb_products') || 'สินค้า'}</Link> &rsaquo; <span>{getProductName()}</span>
          </div>

          <div className="pdp-grid">
            {/* Image */}
            <div className="pdp-img-col">
              {product.image
                ? <img src={product.image} alt={getProductName()} className="pdp-img"/>
                : <div className="pdp-img-ph">{product.category==='meal_box'?'🍱':'🥛'}</div>}
            </div>

            {/* Info */}
            <div className="pdp-info">
              <span className="badge badge-primary">{catLabel(product.category)}</span>
              <h1 className="pdp-name">{getProductName()}</h1>
              {product.name_en && <p className="pdp-name-en">{product.name_en}</p>}
              {product.weight && <p className="pdp-weight">⚖️ {product.weight}</p>}
              {product.description && (
                <div className="pdp-desc-block">
                  <p>{getProductDescription()}</p>
                </div>
              )}
              {product.ingredients && (
                <div className="pdp-ing-block">
                  <p><strong>{t('products_ingredients') || 'ส่วนประกอบ (Main Ingredients):'}</strong></p>
                  <p>{product.ingredients}</p>
                </div>
              )}

              {/* Contact Buttons */}
              <div className="pdp-contact-btns">
                <a href="https://facebook.com/PSUBlen.official" target="_blank" rel="noreferrer" className="pdp-btn pdp-fb">
                  <span>f</span> {t('products_buy_facebook_detail') || 'สั่งซื้อออนไลน์ Facebook'}
                </a>
                <a href="https://line.me" target="_blank" rel="noreferrer" className="pdp-btn pdp-line">
                  <span>L</span> {t('products_buy_line_detail') || 'สั่งซื้อออนไลน์ Line'}
                </a>
                <a href={`tel:${phone.replace(/-/g,'')}`} className="pdp-btn pdp-tel">
                  <span>📞</span> {t('tel') || 'Tel'} : {phone}
                </a>
              </div>
            </div>
          </div>

          <div style={{marginTop:40}}>
            <Link to="/products" className="btn btn-secondary">{t('products_back') || '← กลับไปยังสินค้าทั้งหมด'}</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
