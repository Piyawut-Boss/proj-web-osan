import { useEffect } from 'react';
import PublicLayout from '../../components/public/PublicLayout';
import { useSettings } from '../../hooks/useSettings';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactPage() {
  const { get } = useSettings();
  const { t } = useLanguage();

  const contacts = [
    { icon: '/phone-call.png', title: t('contact_phone'), value: get('contact_phone','062-163-9888 , 097-125-8615') },
    { icon: '/line.png', title: t('contact_line'), value: get('contact_line','@PSUBlen.official') },
    { icon: '/google.png', title: t('contact_email'), value: get('contact_email','psuagrofood.factory@gmail.com') },
    { icon: '/facebook.png', title: t('contact_facebook'), value: get('contact_facebook','PSU Blen.official') },
    { icon: '/tik-tok.png', title: t('contact_tiktok'), value: get('contact_tiktok','PSU Blen.official ,psuagrofood.factory') },
  ];

  const mapUrl = get(
    'contact_map_url',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951!2d100.47!3d7.00!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNw!5e0!3m2!1sen!2sth!4v1'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          <div className="ct-grid">

            <div className="ct-left">
              <h1 className="ct-title">{t('contact_title')}</h1>

              <div className="ct-company">
                <p>{get('contact_company_th','บริษัท พี เอส ยู อะโกรฟู้ด จำกัด')}</p>
                <p>{get('contact_company_en','PSU Agro Food Co.,Ltd.')}</p>
                <p>{get('contact_address','เลขที่ 15 ถ.กาญจนวณิชย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110')}</p>
              </div>

              {get('contact_factory_image') && (
                <div className="ct-factory-img">
                  <img src={get('contact_factory_image')} alt="factory" />
                  <p>{t('contact_factory')}</p>
                </div>
              )}

              <div className="ct-contacts">
                {contacts.map((c, i) => (
                  <div key={i} className="ct-row">
                    <img
                      src={c.icon}
                      alt={c.title}
                      className="ct-icon-img"
                      style={{ width: '18px', height: '18px', flex: '0 0 18px' }}
                    />
                    <span className="ct-label">
                      <strong>{c.title} :</strong> {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ct-right">
              <div className="ct-map-wrap">
                <iframe
                  src={mapUrl}
                  title="map"
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href={`https://maps.google.com/?q=${get('contact_address','')}`}
                target="_blank"
                rel="noreferrer"
                className="ct-map-link"
              >
                {t('contact_directions')}
              </a>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}