import { Link } from 'react-router-dom';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export default function Footer() {
  const { get } = useSettings();
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/">
              <img
                src="/logo.jpg"
                alt="PSU Blen — PSU AGRO FOOD CO., LTD."
                className="footer-logo-img"
              />
            </Link>

            <p className="footer-company-th" style={{ marginTop: 14 }}>
              {get('footer_company_th', 'บริษัท พี เอส ยู อะโกรฟู้ด จำกัด')}
            </p>

            <p className="footer-company-en">
              {get('footer_company_en', 'PSU AGRO FOOD CO., LTD.')}
            </p>

            <div className="footer-contacts">

              <p>
                <img src="/phone-call.png" alt="phone" className="footer-icon" />
                {get('contact_phone', '062-163-9888, 097-125-8615')}
              </p>

              <p>
                <img src="/line.png" alt="line" className="footer-icon" />
                line id: {get('contact_line', '@PSUBlen.official')}
              </p>

              <p>
                <img src="/google.png" alt="email" className="footer-icon" />
                {get('contact_email', 'psuagrofood.factory@gmail.com')}
              </p>

              <p>
                <img src="/facebook.png" alt="facebook" className="footer-icon" />
                facebook: {get('contact_facebook', 'PSU Blen.official')}
              </p>

              <p>
                <img src="/tik-tok.png" alt="tiktok" className="footer-icon" />
                tiktok: {get('contact_tiktok', 'PSU Blen.official ,psuagrofood.factory')}
              </p>

            </div>
          </div>

          <div className="footer-links">
            <h4>{t('footer_menu')}</h4>
            <nav>
              <Link to="/">{t('footer_home')}</Link>
              <Link to="/about">{t('footer_about')}</Link>
              <Link to="/board">{t('nav_about_board')}</Link>
              <Link to="/products">{t('footer_products')}</Link>
              <Link to="/news">{t('footer_news')}</Link>
              <Link to="/certificates">{t('footer_certificates')}</Link>
              <Link to="/contact">{t('footer_contact')}</Link>
            </nav>
          </div>

          <div className="footer-reg">
            <h4>{t('footer_reg')}</h4>

            <p>
              <strong>{t('footer_biz_name')}</strong>
              <br />
              {get('footer_reg_name', 'บริษัท พี เอส ยู อะโกรฟู้ด จำกัด')}
            </p>

            <p>
              <strong>{t('footer_biz_type')}</strong>
              <br />
              {get('footer_reg_type', 'บริษัท')}
            </p>

            <p>
              <strong>{t('footer_address_label')}</strong>
              <br />
              {get(
                'footer_address',
                'เลขที่ 15 ถ.กาญจนวณิชย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom-wrap">
        <div className="container footer-bottom">
          <p>
            © {new Date().getFullYear()} PSU AGRO FOOD CO., LTD.{' '}
            {t('footer_copyright') || 'All rights reserved.'}
          </p>

          <div className="footer-bottom-links">
            <a href="/" className="footer-bottom-link">
              {t('footer_terms')}
            </a>
            <a href="/" className="footer-bottom-link">
              {t('footer_privacy')}
            </a>
            <a href="/admin/login" className="footer-admin-link">
              {t('footer_admin')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}