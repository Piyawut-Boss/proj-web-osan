CREATE DATABASE IF NOT EXISTS psu_agro_food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE psu_agro_food;

DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS certificates;
DROP TABLE IF EXISTS board_members;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS carousel_images;
DROP TABLE IF EXISTS site_settings;

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- password: admin123
INSERT INTO admins (username, password) VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbqIi4rme');

CREATE TABLE banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300),
  subtitle TEXT,
  image VARCHAR(500),
  link_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE carousel_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_section (section)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  name_en VARCHAR(300),
  name_zh VARCHAR(300),
  name_ms VARCHAR(300),
  name_ar VARCHAR(300),
  category ENUM('psu_blen','meal_box','oem') DEFAULT 'psu_blen',
  description TEXT,
  description_en TEXT,
  description_zh TEXT,
  description_ms TEXT,
  description_ar TEXT,
  ingredients TEXT,
  weight VARCHAR(100),
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO products (name, name_en, name_zh, name_ms, name_ar, category, description, description_en, description_zh, description_ms, description_ar, ingredients, weight, sort_order) VALUES
('อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 350 กรัม','Blenderized Diet Chicken Protein 350 g.','混合液体饮食鸡肉蛋白 350 克','Makanan Campuran Siap Makan Formula Protein Ayam 350 gram','غذاء مخلوط جاهز للأكل بصيغة بروتين الدجاج 350 غرام','psu_blen','อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ผลิตโดยทีมนักวิจัยผู้เชี่ยวชาญ ได้รับการรับรองมาตรฐาน อย. และ ฮาลาล','Ready-to-eat blenderized diet with chicken protein, produced by expert researchers, certified by Thai FDA and Halal','混合液体饮食鸡肉蛋白，由专家研究人员生产，获得泰国FDA和清真认证','Makanan campuran siap makan dengan protein ayam, diproduksi oleh peneliti ahli, tersertifikasi oleh FDA Thailand dan Halal','غذاء مخلوط جاهز للأكل يحتوي على بروتين الدجاج، تم إنتاجه بواسطة باحثين خبراء، معتمد من قبل إدارة الغذاء والدواء التايلاندية والحلال','Chicken, Green beans, Mushroom, Rice bran oil, Soy Protein Isolate','350 กรัม',1),
('อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาด 200 กรัม','Blenderized Diet Chicken Protein 200 g.','混合液体饮食鸡肉蛋白 200 克','Makanan Campuran Siap Makan Formula Protein Ayam 200 gram','غذاء مخلوط جاهز للأكل بصيغة بروتين الدجاج 200 غرام','psu_blen','อาหารปั่นเหลวพร้อมทาน สูตรผสมเนื้อไก่ ขนาดพกพา เหมาะสำหรับทานระหว่างวัน','Convenient carry-on size blended meal with chicken protein','便携式混合液体饮食鸡肉蛋白，适合白天食用','Makanan campuran siap makan ukuran portabel dengan protein ayam, cocok untuk dimakan di siang hari','وجبة مخلوط محمولة الحجم جاهزة للأكل مع بروتين الدجاج، مناسبة للفترة الصباحية','Chicken, Green beans, Mushroom, Rice bran oil, Soy Protein Isolate','200 กรัม',2),
('ข้าวแกงมัสมั่นไก่','Chicken Massaman with Rice','鸡肉马萨曼咖喱饭','Nasi Kari Massaman Ayam','أرز وكاري ماسمان الدجاج','meal_box','ข้าวแกงมัสมั่นไก่ รสชาติดี หอมกลิ่นเครื่องเทศ เก็บได้ที่อุณหภูมิห้องนาน 18 เดือน','Classic Thai Massaman curry with chicken over rice, 18 months shelf life at room temperature','经典泰国鸡肉玛莎曼咖喱饭，室温下可保存18个月','Kari Massaman Ayam atas nasi yang klasik, umur simpan 18 bulan pada suhu kamar','كاري ماسمان الدجاج الكلاسيكي فوق الأرز، مدة الحفظ 18 شهرًا في درجة حرارة الغرفة','Rice, Chicken, Curry paste, Potato','270 กรัม',3),
('ข้าวไก่กระเทียม','Stir-Fried Garlic Chicken with Rice','蒜香炒鸡饭','Nasi Ayam Bawang Goreng','أرز دجاج مقلي بالثوم','meal_box','ข้าวไก่กระเทียว หอมกลิ่นกระเทียมทอด รสชาติกลมกล่อม เก็บได้ 18 เดือน','Garlic fried chicken with rice, crispy garlic aroma, 18 months shelf life','蒜香炒鸡饭，香脆的大蒜香味，保存期18个月','Nasi Ayam Bawang Goreng dengan aroma bawang yang renyah, umur simpan 18 bulan','دجاج مقلي بالثوم مع الأرز، نكهة ثوم مقرمش، مدة الصلاحية 18 شهر','Rice, Chicken, Garlic, Potato','270 กรัม',4),
('ข้าวผัดเผ็ดปลาดุก','Stir-Fried Spicy Catfish with Rice','辣炒鲶鱼饭','Nasi Ikan Keli Goreng Pedas','أرز سمك جاموس مقلى حار','meal_box','ข้าวผัดเผ็ดปลาดุก รสจัดจ้าน เผ็ดหอม อร่อยถูกใจคนชอบรสเผ็ด','Spicy catfish stir-fry with rice, bold and flavorful','辣炒鲶鱼饭，大胆浓郁的味道','Nasi Ikan Keli Pedas yang tumis pedas, berani dan berasa kuat','أرز سمك الجاموس المقلي الحار، جريء وبنكهة قوية','Rice, Catfish, Curry paste','270 กรัม',5),
('ข้าวแกงส้มปลาทู','Sour Curry Mackerel with Rice','酸咖喱鲭鱼饭','Nasi Kari Asam Ikan Tenggiri','أرز كاري حامض سمك الإسقمري','meal_box','ข้าวแกงส้มปลาทู รสเปรี้ยวเผ็ด กลิ่นหอมของแกงส้มแท้ๆ','Tangy sour curry mackerel with rice, authentic southern Thai flavor','酸咖喱鲭鱼饭，酸辣味，真正的泰国南部风味','Nasi Kari Asam Ikan Tenggiri dengan rasa asam yang tajam, cita rasa autentik Thai Selatan','أرز كاري حامض سمك الإسقمري برائحة ولا طعم حامضة أصيلة من جنوب تايلاند','Rice, Mackerel, Sour Curry paste','170 กรัม',6);

CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content LONGTEXT,
  image VARCHAR(500),
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO certificates (title, sort_order) VALUES
('หนังสือให้ใช้เครื่องหมายรับรองฮาลาล', 1),
('ใบอนุญาตผลิตอาหาร', 2),
('ใบสำคัญการจดทะเบียนอาหาร', 3);

CREATE TABLE board_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  position VARCHAR(300),
  board_type ENUM('board','management') DEFAULT 'board',
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO board_members (name, position, board_type, sort_order) VALUES
('ผศ.ดร.พงค์เทพ สุธีรวุฒิ','ประธานบริษัท','board',1),
('รศ.ธีรวัฒน์ หังสพฤกษ์','กรรมการ','board',2),
('ผศ.นพ กิตติพงศ์ เรียบร้อย','กรรมการ','board',3),
('ผศ.ดร.เสาวคนธ์ วัฒนจันทร์','กรรมการ','board',4),
('ผศ.ดร.เสาวคนธ์ วัฒนจันทร์','กรรมการผู้จัดการ','management',1),
('นายวัชรินทร์ เมืองจันทบุรี','ผู้ช่วยกรรมการผู้จัดการ','management',2),
('นายสุวิชาญ เตียวสกุล','ผู้ช่วยกรรมการผู้จัดการ','management',3),
('นางสาวกรวรรณ รอดเข็ม','ผู้จัดการโรงงาน','management',4);

CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(200) NOT NULL UNIQUE,
  setting_value LONGTEXT,
  setting_type ENUM('text','textarea','image') DEFAULT 'text',
  label VARCHAR(300),
  section VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO site_settings (setting_key, setting_value, setting_type, label, section) VALUES
-- ── HERO ──────────────────────────────────────────────────────────────────
('hero_banner_image','','image','รูปแบนเนอร์หลัก','hero'),
('hero_title_line1','เพิ่มพลังงาน','text','หัวข้อบรรทัด 1','hero'),
('hero_title_line2','และสุขภาพ','text','หัวข้อบรรทัด 2','hero'),
('hero_title_line3','ด้วย PSU Blen','text','หัวข้อบรรทัด 3','hero'),
('hero_tagline','อาหารปั่นเหลวที่คุณเลือก','text','สโลแกน','hero'),
('hero_description','ผลิตโดยอาศัยมาตรฐานโภชนาการและคณะอุตสาหกรรมเกษตร มหาวิทยาลัยสงขลานครินทร์ เพื่อคุณภาพชีวิตที่ดีขึ้น','textarea','คำอธิบาย','hero'),
('hero_stat1','14+|เดือนอายุเก็บรักษา','text','สถิติ 1 (ตัวเลข|คำอธิบาย)','hero'),
('hero_stat2','GMP|มาตรฐานการผลิต','text','สถิติ 2 (ตัวเลข|คำอธิบาย)','hero'),
('hero_stat3','Halal|รับรองฮาลาล','text','สถิติ 3 (ตัวเลข|คำอธิบาย)','hero'),
('hero_stat4','อย.|รับรองอาหาร','text','สถิติ 4 (ตัวเลข|คำอธิบาย)','hero'),
-- ── SHOWCASE ─────────────────────────────────────────────────────────────
('showcase_title_th','PSU Blen อาหารปั่นเหลวพร้อมทาน','text','Showcase หัวข้อ บรรทัด 1','showcase'),
('showcase_title_th2','สูตรผสมเนื้อไก่','text','Showcase หัวข้อ บรรทัด 2','showcase'),
-- ── MEAL BOX ─────────────────────────────────────────────────────────────
('mealbox_image','','image','รูปอาหารกล่อง','mealbox'),
('mealbox_title','อาหารกล่องพร้อมทาน','text','หัวข้ออาหารกล่อง (ไทย)','mealbox'),
('mealbox_subtitle','Ready-to-Eat Meal Box','text','หัวข้ออาหารกล่อง (อังกฤษ)','mealbox'),
('mealbox_desc1','อร่อย สะดวก ปลอดภัย ได้รับการรับรองมาตรฐาน','text','คำบรรยาย บรรทัด 1','mealbox'),
('mealbox_desc2','Delicious · Convenient · Safe','text','คำบรรยาย บรรทัด 2','mealbox'),
('mealbox_desc3','Certified Quality (Thai FDA & Halal)','text','คำบรรยาย บรรทัด 3','mealbox'),
-- ── WHY/ACCORDION ─────────────────────────────────────────────────────────
('why_title','ทำไม PSU Blend ถึงดีกว่าการทำอาหารปั่นเอง?','text','หัวข้อส่วน Why','why'),
('why_item1_title','สะอาด ปลอดภัย มั่นใจได้','text','Why 1 หัวข้อ','why'),
('why_item1_body','ผลิตในสภาพแวดล้อมที่ควบคุมความสะอาดทุกขั้นตอน ลดความเสี่ยงจากการปนเปื้อนหรือโรคที่อาจเกิดจากการเตรียมอาหารเอง','textarea','Why 1 เนื้อหา','why'),
('why_item2_title','พร้อมใช้ ประหยัดเวลา','text','Why 2 หัวข้อ','why'),
('why_item2_body','ไม่ต้องเตรียมวัตถุดิบ ไม่ต้องล้างอุปกรณ์ แค่ฉีกของพร้อมรับประทาน','textarea','Why 2 เนื้อหา','why'),
('why_item3_title','เนื้อเนียน ละเอียด กลืนง่าย','text','Why 3 หัวข้อ','why'),
('why_item3_body','ใช้เทคนิคเฉพาะในการปั่นให้ได้ความละเอียดเหมาะสำหรับผู้ที่มีปัญหาในการเคี้ยวหรือกลืน','textarea','Why 3 เนื้อหา','why'),
-- ── TODAY ─────────────────────────────────────────────────────────────────
('today_bg_image','','image','รูปพื้นหลัง Today','today'),
('today_label','PSU AGRO FOOD TODAY','text','ป้ายกำกับ Today','today'),
('today_title_th','นวัตกรรมและงานวิจัยอาหารเชิงพาณิชย์','text','หัวข้อ Today บรรทัด 1 (ไทย)','today'),
('today_title_th2','เพื่อสังคม และการเติบโตอย่างยั่งยืน','text','หัวข้อ Today บรรทัด 2 (ไทย)','today'),
('today_title_en','"Advancing Food Innovation and Commercial Research for a Sustainable Society"','textarea','หัวข้อ Today (อังกฤษ)','today'),
-- ── ABOUT ─────────────────────────────────────────────────────────────────
('vision_title','วิสัยทัศน์','text','หัวข้อวิสัยทัศน์','about'),
('vision_text','ผู้นำด้านการวิจัยและผลิตอาหารเพื่อสุขภาพด้วยนวัตกรรมที่เติบโตไปพร้อมกับสังคมที่ดี','textarea','ข้อความวิสัยทัศน์','about'),
('mission_title','พันธกิจบริษัท','text','หัวข้อพันธกิจ','about'),
('mission_item1_title','ต่อลูกค้า','text','พันธกิจ 1 หัวข้อ','about'),
('mission_item1_desc','พัฒนานวัตกรรมอาหารเพื่อสุขภาพ.....เพื่อชีวิตที่ดีกว่า','textarea','พันธกิจ 1 เนื้อหา','about'),
('mission_item2_title','ต่อสังคม','text','พันธกิจ 2 หัวข้อ','about'),
('mission_item2_desc','เราคือผู้นำนวัตกรรมอาหารเพื่อสุขภาพของประเทศไทย และเป็นแหล่งเรียนรู้ บูรณาการการเรียนและการวิจัย','textarea','พันธกิจ 2 เนื้อหา','about'),
('mission_item3_title','ต่อพนักงาน','text','พันธกิจ 3 หัวข้อ','about'),
('mission_item3_desc','สนับสนุนและพัฒนาความสามารถกองพนักงานให้มีความเป็นมืออาชีพ สร้างคุณภาพชีวิตที่ดี','textarea','พันธกิจ 3 เนื้อหา','about'),
('mission_item4_title','ต่อผู้ถือหุ้น','text','พันธกิจ 4 หัวข้อ','about'),
('mission_item4_desc','ใช้นวัตกรรมสร้างธุรกิจเพื่อเพิ่มประสิทธิภาพการจัดการและต่อยอดผู้ถือหุ้นประกอบการที่ดี','textarea','พันธกิจ 4 เนื้อหา','about'),
('core_values_title','ค่านิยมองค์กร','text','หัวข้อค่านิยม','about'),
('core_value1_title','งานวิจัยสร้างสรรค์','text','ค่านิยม 1 หัวข้อ','about'),
('core_value1_image','','image','ค่านิยม 1 รูป','about'),
('core_value2_title','นวัตกรรมด้านอาหารสุขภาพ','text','ค่านิยม 2 หัวข้อ','about'),
('core_value2_image','','image','ค่านิยม 2 รูป','about'),
('core_value3_title','ทำงานเป็นทีม','text','ค่านิยม 3 หัวข้อ','about'),
('core_value3_image','','image','ค่านิยม 3 รูป','about'),
('core_value4_title','มุ่งมั่นสู่ความเป็นเลิศ','text','ค่านิยม 4 หัวข้อ','about'),
('core_value4_image','','image','ค่านิยม 4 รูป','about'),
-- ── TIMELINE ──────────────────────────────────────────────────────────────
('timeline_title','เหตุการณ์สำคัญของบริษัท','text','หัวข้อ Timeline','timeline'),
('timeline_item1_year','ปี 2567','text','Timeline 1 ปี','timeline'),
('timeline_item1_image','','image','Timeline 1 รูป','timeline'),
('timeline_item1_events','ก่อตั้งบริษัท พีเอสยู อะโกรฟู้ด จำกัด เมื่อวันที่ 7 พฤษภาคม 2567\nเริ่มติดตั้งเครื่องจักร เมื่อวันที่ 23 ธันวาคม 2567','textarea','Timeline 1 เหตุการณ์ (แต่ละบรรทัดคือ 1 เหตุการณ์)','timeline'),
('timeline_item2_year','ปี 2568','text','Timeline 2 ปี','timeline'),
('timeline_item2_image','','image','Timeline 2 รูป','timeline'),
('timeline_item2_events','ติดตั้งเครื่องจักรแล้วเสร็จ เมื่อวันที่ 28 พฤษภาคม 2568\nเริ่มผลิตอาหารกล่องพร้อมทาน เมื่อวันที่ 24 กรกฎาคม 2568','textarea','Timeline 2 เหตุการณ์','timeline'),
('timeline_item3_year','ปัจจุบัน','text','Timeline 3 ปี','timeline'),
('timeline_item3_image','','image','Timeline 3 รูป','timeline'),
('timeline_item3_events','มีสินค้า PSU Blen อาหารปั่นเหลวพร้อมทาน\nสินค้าอาหารกล่องพร้อมทาน (Ready to eat Meal Box)\nบริการ OEM, ODM ให้ลูกค้าครบวงจร','textarea','Timeline 3 เหตุการณ์','timeline'),
-- ── TODAY BODY (about page) ────────────────────────────────────────────────
('today_body_title','PSU Agro Food Today','text','หัวข้อ Today ในหน้าเกี่ยวกับเรา','about'),
('today_body_text','บริษัท พี เอส ยู อะโกรฟู้ด จำกัด เริ่มต้นจากการเป็นผู้วิจัยนวัตกรรมอาหาร มหาวิทยาลัยสงขลานครินทร์ และได้จดทะเบียนบริษัทเป็นนิติบุคคลในเดือนพฤษภาคม 2567\n\nบริษัทได้นำผลงานวิจัยและนวัตกรรมอาหารปั่นเหลวพร้อมทาน ตรา พีเอสยู เบลน เป็นผลิตภัณฑ์เชิงพาณิชย์ สำหรับผู้สูงอายุและเป็นผู้บริโภคที่ต้องการอาหารเหลว\n\nต่อมาบริษัทได้ผลิตอาหารกล่องพร้อมทาน ตราแกรป อะโกร (Grab Agro Brand) เก็บรักษาที่อุณหภูมิห้องได้นาน 18 เดือน เมนูต่างๆ ข้าวแกงมัสมั่นไก่ ข้าวไก่กระเทียว ข้าวผัดเผ็ดปลาดุก ข้าวแกงส้มปลาทู และอื่นๆ\n\nนอกจากนี้บริษัทยังมีบริการรับผลิตอาหารตามมาตรฐาน GMP, อย., Halal ได้แก่ อาหารพร้อมทาน, ซอส, เครื่องปรุง และบริการ OEM, ODM สำหรับอาหารปรับตรงและกรดต่ำในภาชนะปิดสนิท พร้อมพัฒนาสูตร ทดสอบสูตรให้ลูกค้า พัฒนาผลิตภัณฑ์ให้ลูกค้าครบวงจร','textarea','เนื้อหา PSU Agro Food Today','about'),
-- ── PARTNER IMAGES ────────────────────────────────────────────────────────
('partner_img1','','image','รูปพาร์ทเนอร์ 1','partners'),
('partner_img2','','image','รูปพาร์ทเนอร์ 2','partners'),
('partner_img3','','image','รูปพาร์ทเนอร์ 3','partners'),
-- ── PRODUCTS PAGE BANNER ──────────────────────────────────────────────────
('products_banner_image','','image','รูปแบนเนอร์หน้าสินค้า','products'),
('products_banner_title','นวัตกรรมอาหารจากมหาวิทยาลัยสงขลานครินทร์','text','หัวข้อแบนเนอร์หน้าสินค้า','products'),
('products_banner_subtitle','สร้างคุณภาพชีวิตของทุกคนที่ดีกว่า','text','คำบรรยายแบนเนอร์หน้าสินค้า','products'),
-- ── OEM ───────────────────────────────────────────────────────────────────
('oem_banner_image','','image','รูปแบนเนอร์ OEM','oem'),
('oem_title','บริการ OEM รับผลิตอาหารและเครื่องดื่มครบวงจร','text','หัวข้อ OEM','oem'),
('oem_desc','เราให้บริการ OEM รับผลิตอาหาร, ซอส, เครื่องปรุง และเครื่องดื่ม ครบวงจร ด้วยเครื่องจักรที่ทันสมัยและได้มาตรฐาน GMP, อย., Halal\n\nOEM WITH US 5 EASY STEP\nSTEP 1 Meet our RD team — พบกับทีมนักวิจัยของเรา\nSTEP 2 Lab scale — วิจัยและพัฒนาสูตรอาหารและทดสอบในระดับห้องปฏิบัติการ\nSTEP 3 FDA Registration — ขอแก้ทะเบียน ออกแบบบรรจุภัณฑ์\nSTEP 4 Upscale — กระบวนการขยายการผลิตจากระดับห้องปฏิบัติการ\nSTEP 5 Commercial Scale — การผลิตเชิงพาณิชย์','textarea','รายละเอียด OEM','oem'),
('oem_tagline','PSU AGRO FOOD\n"สร้างสรรค์อนาคตของอาหารสุขภาพ เคียงข้างสังคม"','textarea','Tagline OEM','oem'),
('oem_contact_phone','097-125-8615','text','เบอร์โทร OEM','oem'),
('oem_contact_email','psuagrofood.factory@gmail.com','text','Email OEM','oem'),
-- ── CONTACT ───────────────────────────────────────────────────────────────
('contact_factory_image','','image','รูปโรงงาน','contact'),
('contact_company_th','บริษัท พี เอส ยู อะโกรฟู้ด จำกัด','text','ชื่อบริษัท (ไทย)','contact'),
('contact_company_en','PSU Agro Food Co.,Ltd.','text','ชื่อบริษัท (อังกฤษ)','contact'),
('contact_address','เลขที่ 15 ถ.กาญจนวณิชย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110','textarea','ที่อยู่','contact'),
('contact_phone','062-163-9888 , 097-125-8615','text','เบอร์โทรศัพท์','contact'),
('contact_line','@PSUBlen.official','text','Line ID','contact'),
('contact_email','psuagrofood.factory@gmail.com','text','Email','contact'),
('contact_facebook','PSU Blen.official','text','Facebook','contact'),
('contact_tiktok','PSU Blen.official ,psuagrofood.factory','text','TikTok','contact'),
('contact_map_url','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15805.64!2d100.4736!3d7.0067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d4c4a53571b07%3A0x748a58dc29440f0c!2sPSU%20Agro%20Food!5e0!3m2!1sth!2sth!4v1700000000000','textarea','Google Maps Embed URL','contact'),
-- ── FOOTER ────────────────────────────────────────────────────────────────
('footer_company_th','บริษัท พี เอส ยู อะโกรฟู้ด จำกัด','text','ชื่อบริษัท Footer (ไทย)','footer'),
('footer_company_en','PSU AGRO FOOD CO., LTD.','text','ชื่อบริษัท Footer (อังกฤษ)','footer'),
('footer_reg_biz','บริษัท พี เอส ยู อะโกรฟู้ด จำกัด','text','ชื่อธุรกิจ','footer'),
('footer_reg_type','บริษัท','text','ประเภทนิติบุคคล','footer'),
('footer_reg_address','เลขที่ 15 ถ.กาญจนวณิชย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110','textarea','ที่อยู่จดทะเบียน','footer');
