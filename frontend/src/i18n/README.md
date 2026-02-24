# ระบบแปลภาษา PSU Agro Food | Multi-Language System

## 📋 ภาษาที่รองรับ | Supported Languages
- 🇹🇭 **ไทย** (Thai) - Default
- 🇬🇧 **English** (English)
- 🇨🇳 **中文** (Simplified Chinese)
- 🇲🇾 **Melayu** (Malay)
- 🇸🇦 **العربية** (Arabic) - RTL Support

---

## 🎯 วิธีการใช้ | How to Use

### สำหรับผู้ใช้งาน | For Users:
1. ค้นหาปุ่ม Language Switcher ที่มุมบนของหน้าเว็บ
2. คลิกเพื่อเลือกภาษาที่ต้องการ
3. เว็บไซต์จะแปลงเป็นภาษาที่คุณเลือก
4. ตัวเลือกภาษาจะถูกบันทึกใน Local Storage

---

## 👨‍💻 สำหรับนักพัฒนา | For Developers:

### โครงสร้างไฟล์ | File Structure:
```
frontend/src/
├── i18n/
│   ├── index.js          # Language config & definitions
│   ├── th.js             # Thai translations
│   ├── en.js             # English translations
│   ├── zh.js             # Chinese translations
│   ├── ms.js             # Malay translations
│   └── ar.js             # Arabic translations
├── context/
│   └── LanguageContext.jsx   # Language context provider
└── components/public/
    └── LanguageSwitcher.jsx  # Language switcher UI
```

### การใช้ Language Hook | Using Language Hook:

#### ในส่วน Components:
```jsx
import { useLanguage } from '../context/LanguageContext';

export default function MyComponent() {
  const { t, lang, changeLang, LANGUAGES } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav_home')}</h1>           // ใช้ translation key
      <p>Current Language: {lang}</p>
      <p>{t('products_search')}</p>
    </div>
  );
}
```

### เพิ่มการแปลใหม่ | Adding New Translations:

#### 1. เพิ่ม Key ใน i18n files:
```javascript
// frontend/src/i18n/th.js
const th = {
  my_new_key: 'ค่าที่ต้องการแปล',
  // ... other keys
};

// frontend/src/i18n/en.js
const en = {
  my_new_key: 'Translation value',
  // ... other keys
};
```

#### 2. ใช้งานใน Component:
```jsx
<button>{t('my_new_key')}</button>
```

---

## 🎨 ส่วนประกอบที่รองรับ | Supported Components:

### Navigation (เมนูนำทาง):
- `nav_home` - Home link
- `nav_about`, `nav_products`, `nav_news`, etc.

### Pages (หน้าต่างๆ):
- **Home Page** - `home_*` keys
- **Products Page** - `products_*` keys
- **About Page** - `about_*` keys
- **News Page** - `news_*` keys
- **Contact Page** - `contact_*` keys

### Admin (ส่วนจัดการ):
- `admin_login_title`, `admin_username`, `admin_password`, etc.

### Common (ทั่วไป):
- `loading`, `error`, `success`, `save`, `cancel`, `delete`, etc.

---

## 🔄 Language Context Provider:

### Props ที่ return:
```javascript
{
  lang: 'th',              // Current language code
  t: function,             // Translation function: t(key)
  changeLang: function,    // Change language: changeLang(languageCode)
  LANGUAGES: Array         // List of available languages
}
```

### Language Definition:
```javascript
LANGUAGES = [
  { code: 'th', label: 'ไทย',    flag: '🇹🇭', dir: 'ltr' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'zh', label: '中文',    flag: '🇨🇳', dir: 'ltr' },
  { code: 'ms', label: 'Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
]
```

---

## 🌐 Features:

✅ **5 ภาษา** - Thai, English, Chinese, Malay, Arabic
✅ **RTL Support** - Arabic language with right-to-left direction
✅ **Local Storage** - การตั้งค่าภาษาจะถูกบันทึก
✅ **Easy Integration** - ใช้ Hook pattern เพื่อความง่ายดาย
✅ **Fallback** - ถ้าไม่มี Key จะกลับไปเป็นค่า default (Thai)
✅ **Document Direction** - เปลี่ยน `dir` attribute ตามภาษา
✅ **Lang Attribute** - เพิ่ม `lang` attribute ใน HTML tag

---

## 📝 Internationalization Keys Reference:

### Navigation Keys:
```
nav_home, nav_about, nav_about_company, nav_about_board, 
nav_products, nav_news, nav_certificates, nav_contact
```

### Home Page Keys:
```
home_buy_facebook, home_buy_line, home_read_more, home_view_all,
home_our_products, home_hero_title, home_hero_tagline, home_hero_desc
```

### Products Page Keys:
```
products_all, products_search, products_notfound, products_oem_contact,
products_back, products_ingredients, products_buy_facebook, products_buy_line,
products_weight, products_category_psu_blen, products_category_meal_box, products_category_oem
```

### About Page Keys:
```
about_today_title, about_board_title, about_management_title,
about_vision_title, about_mission_title, about_values_title,
about_timeline_title, about_partners_title
```

### News Page Keys:
```
news_title, news_reviews, news_empty, news_reviews_empty,
news_source, news_back, news_date
```

### Certificates Page Keys:
```
cert_title, cert_empty
```

### Contact Page Keys:
```
contact_title, contact_factory, contact_directions, contact_company_name,
contact_address, contact_phone, contact_email, contact_line,
contact_facebook, contact_tiktok
```

### Footer Keys:
```
footer_menu, footer_reg, footer_biz_name, footer_biz_type,
footer_address_label, footer_copyright, footer_admin,
footer_terms, footer_privacy
```

### Admin Keys:
```
admin_login_title, admin_username, admin_password, admin_login_btn,
admin_dashboard, admin_logout, admin_products, admin_news, admin_settings
```

### Common Keys:
```
loading, not_found, tel, error, success, save, cancel, delete, edit, add, close
```

---

## 🚀 การเริ่มต้น | Getting Started:

```jsx
// App.jsx - Make sure LanguageProvider wraps the app
import { LanguageProvider } from './context/LanguageContext';
import LanguageSwitcher from './components/public/LanguageSwitcher';

export default function App() {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
      {/* Your pages and components */}
    </LanguageProvider>
  );
}
```

---

## 📱 Browser Support:

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ Supports RTL languages (Arabic)
- ✅ Automatic persists to Local Storage

---

## 🐛 Troubleshooting:

**Q: ไม่บันทึกการเลือกภาษา?**
A: ตรวจสอบ Local Storage ว่าเปิด (ต้องอนุญาต browser)

**Q: ข้อความแสดงเป็น Key แทนการแปล?**
A: เพิ่ม Key ใน language files และใช้ `t('key')` ใน component

**Q: ไม่รองรับภาษาอื่น?**
A: เพิ่ม language file ใหม่ใน `i18n/` แล้ว export ใน `i18n/index.js`

---

**Last Updated:** February 22, 2026
**Version:** 1.0
