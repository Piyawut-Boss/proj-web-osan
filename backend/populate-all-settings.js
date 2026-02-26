const db = require('./models/db');

const allSettings = [
  // HERO
  {key:'hero_banner_image',val:'',type:'image',label:'รูปแบนเนอร์หลัก',section:'hero'},
  {key:'hero_title_line1',val:'เพิ่มพลังงาน',type:'text',label:'หัวข้อบรรทัด 1',section:'hero'},
  {key:'hero_title_line2',val:'และสุขภาพ',type:'text',label:'หัวข้อบรรทัด 2',section:'hero'},
  {key:'hero_title_line3',val:'ด้วย PSU Blen',type:'text',label:'หัวข้อบรรทัด 3',section:'hero'},
  {key:'hero_tagline',val:'อาหารปั่นเหลวที่คุณเลือก',type:'text',label:'สโลแกน',section:'hero'},
  {key:'hero_description',val:'ผลิตโดยอาศัยมาตรฐานโภชนาการและคณะอุตสาหกรรมเกษตร มหาวิทยาลัยสงขลานครินทร์ เพื่อคุณภาพชีวิตที่ดีขึ้น',type:'textarea',label:'คำอธิบาย',section:'hero'},
  {key:'hero_stat1',val:'14+|เดือนอายุเก็บรักษา',type:'text',label:'สถิติ 1',section:'hero'},
  {key:'hero_stat2',val:'GMP|มาตรฐานการผลิต',type:'text',label:'สถิติ 2',section:'hero'},
  {key:'hero_stat3',val:'Halal|รับรองฮาลาล',type:'text',label:'สถิติ 3',section:'hero'},
  {key:'hero_stat4',val:'อย.|รับรองอาหาร',type:'text',label:'สถิติ 4',section:'hero'},
  
  // SHOWCASE
  {key:'showcase_title_th',val:'PSU Blen อาหารปั่นเหลวพร้อมทาน',type:'text',label:'Showcase หัวข้อบรรทัด 1',section:'showcase'},
  {key:'showcase_title_th2',val:'สูตรผสมเนื้อไก่',type:'text',label:'Showcase หัวข้อบรรทัด 2',section:'showcase'},
  
  // MEALBOX
  {key:'mealbox_image',val:'',type:'image',label:'รูปอาหารกล่อง',section:'mealbox'},
  {key:'mealbox_title',val:'อาหารกล่องพร้อมทาน',type:'text',label:'หัวข้อ (ไทย)',section:'mealbox'},
  {key:'mealbox_subtitle',val:'Ready-to-Eat Meal Box',type:'text',label:'หัวข้อ (อังกฤษ)',section:'mealbox'},
  {key:'mealbox_desc1',val:'อร่อย สะดวก ปลอดภัย ได้รับการรับรองมาตรฐาน',type:'text',label:'คำบรรยาย 1',section:'mealbox'},
  {key:'mealbox_desc2',val:'Delicious · Convenient · Safe',type:'text',label:'คำบรรยาย 2',section:'mealbox'},
  {key:'mealbox_desc3',val:'Certified Quality (Thai FDA & Halal)',type:'text',label:'คำบรรยาย 3',section:'mealbox'},
  
  // ACCORDION/WHY
  {key:'why_title',val:'ทำไม PSU Blend ถึงดีกว่าการทำอาหารปั่นเอง?',type:'text',label:'หัวข้อส่วน Why',section:'accordion'},
  {key:'why_item1_title',val:'สะอาด ปลอดภัย มั่นใจได้',type:'text',label:'Why 1 หัวข้อ',section:'accordion'},
  {key:'why_item1_body',val:'ผลิตในสภาพแวดล้อมที่ควบคุมความสะอาดทุกขั้นตอน ลดความเสี่ยงจากการปนเปื้อนหรือโรคที่อาจเกิดจากการเตรียมอาหารเอง',type:'textarea',label:'Why 1 เนื้อหา',section:'accordion'},
  {key:'why_item2_title',val:'พร้อมใช้ ประหยัดเวลา',type:'text',label:'Why 2 หัวข้อ',section:'accordion'},
  {key:'why_item2_body',val:'ไม่ต้องเตรียมวัตถุดิบ ไม่ต้องล้างอุปกรณ์ แค่ฉีกของพร้อมรับประทาน',type:'textarea',label:'Why 2 เนื้อหา',section:'accordion'},
  {key:'why_item3_title',val:'เนื้อเนียน ละเอียด กลืนง่าย',type:'text',label:'Why 3 หัวข้อ',section:'accordion'},
  {key:'why_item3_body',val:'ใช้เทคนิคเฉพาะในการปั่นให้ได้ความละเอียดเหมาะสำหรับผู้ที่มีปัญหาในการเคี้ยวหรือกลืน',type:'textarea',label:'Why 3 เนื้อหา',section:'accordion'},
  
  // TODAY
  {key:'today_bg_image',val:'',type:'image',label:'รูปพื้นหลัง Today',section:'today'},
  {key:'today_label',val:'PSU AGRO FOOD TODAY',type:'text',label:'ป้ายกำกับ Today',section:'today'},
  {key:'today_title_th',val:'นวัตกรรมและงานวิจัยอาหารเชิงพาณิชย์',type:'text',label:'หัวข้อ Today บรรทัด 1',section:'today'},
  {key:'today_title_th2',val:'เพื่อสังคม และการเติบโตอย่างยั่งยืน',type:'text',label:'หัวข้อ Today บรรทัด 2',section:'today'},
  {key:'today_title_en',val:'"Advancing Food Innovation and Commercial Research for a Sustainable Society"',type:'textarea',label:'หัวข้อ Today (อังกฤษ)',section:'today'},
  
  // VISION
  {key:'vision_title',val:'วิสัยทัศน์',type:'text',label:'หัวข้อวิสัยทัศน์',section:'vision'},
  {key:'vision_text',val:'ผู้นำด้านการวิจัยและผลิตอาหารเพื่อสุขภาพด้วยนวัตกรรมที่เติบโตไปพร้อมกับสังคมที่ดี',type:'textarea',label:'ข้อความวิสัยทัศน์',section:'vision'},
  
  // MISSION
  {key:'mission_title',val:'พันธกิจบริษัท',type:'text',label:'หัวข้อพันธกิจ',section:'mission'},
  {key:'mission_item1_title',val:'ต่อลูกค้า',type:'text',label:'พันธกิจ 1 หัวข้อ',section:'mission'},
  {key:'mission_item1_desc',val:'พัฒนานวัตกรรมอาหารเพื่อสุขภาพ\nเพื่อชีวิตที่ดีกว่า',type:'textarea',label:'พันธกิจ 1 เนื้อหา',section:'mission'},
  {key:'mission_item2_title',val:'ต่อสังคม',type:'text',label:'พันธกิจ 2 หัวข้อ',section:'mission'},
  {key:'mission_item2_desc',val:'เราคือผู้นำนวัตกรรมอาหารเพื่อสุขภาพของประเทศไทย\nและเป็นแหล่งเรียนรู้ บูรณาการการเรียนและการวิจัย',type:'textarea',label:'พันธกิจ 2 เนื้อหา',section:'mission'},
  {key:'mission_item3_title',val:'ต่อพนักงาน',type:'text',label:'พันธกิจ 3 หัวข้อ',section:'mission'},
  {key:'mission_item3_desc',val:'สนับสนุนและพัฒนาความสามารถของพนักงานให้\nมีความเป็นมืออาชีพ สร้างคุณภาพชีวิตที่ดี',type:'textarea',label:'พันธกิจ 3 เนื้อหา',section:'mission'},
  {key:'mission_item4_title',val:'ต่อผู้ถือหุ้น',type:'text',label:'พันธกิจ 4 หัวข้อ',section:'mission'},
  {key:'mission_item4_desc',val:'ใช้นวัตกรรมสร้างธุรกิจเพื่อเพิ่มประสิทธิภาพการจัดการ\nและต่อยอดสู่ผลประกอบการที่ดี',type:'textarea',label:'พันธกิจ 4 เนื้อหา',section:'mission'},
  
  // CORE VALUES
  {key:'core_values_title',val:'ค่านิยมองค์กร',type:'text',label:'หัวข้อค่านิยม',section:'core_values'},
  {key:'core_value1_title',val:'งานวิจัยสร้างสรรค์',type:'text',label:'ค่านิยม 1 หัวข้อ',section:'core_values'},
  {key:'core_value1_image',val:'',type:'image',label:'ค่านิยม 1 รูป',section:'core_values'},
  {key:'core_value2_title',val:'นวัตกรรมด้านอาหารสุขภาพ',type:'text',label:'ค่านิยม 2 หัวข้อ',section:'core_values'},
  {key:'core_value2_image',val:'',type:'image',label:'ค่านิยม 2 รูป',section:'core_values'},
  {key:'core_value3_title',val:'ทำงานเป็นทีม',type:'text',label:'ค่านิยม 3 หัวข้อ',section:'core_values'},
  {key:'core_value3_image',val:'',type:'image',label:'ค่านิยม 3 รูป',section:'core_values'},
  {key:'core_value4_title',val:'มุ่งมั่นสู่ความเป็นเลิศ',type:'text',label:'ค่านิยม 4 หัวข้อ',section:'core_values'},
  {key:'core_value4_image',val:'',type:'image',label:'ค่านิยม 4 รูป',section:'core_values'},
  
  // TIMELINE
  {key:'timeline_title',val:'เหตุการณ์สำคัญของบริษัท',type:'text',label:'หัวข้อ Timeline',section:'timeline'},
  {key:'timeline_item1_year',val:'ปี 2567',type:'text',label:'Timeline 1 ปี',section:'timeline'},
  {key:'timeline_item1_image',val:'',type:'image',label:'Timeline 1 รูป',section:'timeline'},
  {key:'timeline_item1_events',val:'ก่อตั้งบริษัท พีเอสยู อะโกรฟู้ด จำกัด\nเริ่มติดตั้งเครื่องจักร',type:'textarea',label:'Timeline 1 เหตุการณ์',section:'timeline'},
  {key:'timeline_item2_year',val:'ปี 2568',type:'text',label:'Timeline 2 ปี',section:'timeline'},
  {key:'timeline_item2_image',val:'',type:'image',label:'Timeline 2 รูป',section:'timeline'},
  {key:'timeline_item2_events',val:'ติดตั้งเครื่องจักรแล้วเสร็จ\nเริ่มผลิตอาหารกล่องพร้อมทาน',type:'textarea',label:'Timeline 2 เหตุการณ์',section:'timeline'},
  {key:'timeline_item3_year',val:'ปัจจุบัน',type:'text',label:'Timeline 3 ปี',section:'timeline'},
  {key:'timeline_item3_image',val:'',type:'image',label:'Timeline 3 รูป',section:'timeline'},
  {key:'timeline_item3_events',val:'มีสินค้า PSU Blen อาหารปั่นเหลวพร้อมทาน\nสินค้าอาหารกล่องพร้อมทาน\nบริการ OEM, ODM ครบวงจร',type:'textarea',label:'Timeline 3 เหตุการณ์',section:'timeline'},
  
  // OEM
  {key:'oem_banner_image',val:'',type:'image',label:'รูปแบนเนอร์ OEM',section:'oem'},
  {key:'oem_title',val:'บริการ OEM รับผลิตอาหารและเครื่องดื่มครบวงจร',type:'text',label:'หัวข้อ OEM',section:'oem'},
  {key:'oem_desc',val:'เราให้บริการ OEM รับผลิตอาหาร ซอส เครื่องปรุง และเครื่องดื่ม ครบวงจร ด้วยเครื่องจักรที่ทันสมัย',type:'textarea',label:'รายละเอียด OEM',section:'oem'},
  {key:'oem_contact_phone',val:'097-125-8615',type:'text',label:'เบอร์โทร OEM',section:'oem'},
  {key:'oem_contact_email',val:'psuagrofood.factory@gmail.com',type:'text',label:'Email OEM',section:'oem'},
  
  // PARTNERS
  {key:'partner_image1',val:'',type:'image',label:'รูปพาร์ทเนอร์ 1',section:'partners'},
  {key:'partner_image2',val:'',type:'image',label:'รูปพาร์ทเนอร์ 2',section:'partners'},
  {key:'partner_image3',val:'',type:'image',label:'รูปพาร์ทเนอร์ 3',section:'partners'},
  
  // CONTACT
  {key:'contact_company_th',val:'บริษัท พี เอส ยู อะโกรฟู้ด จำกัด',type:'text',label:'ชื่อบริษัท (ไทย)',section:'contact'},
  {key:'contact_company_en',val:'PSU Agro Food Co.,Ltd.',type:'text',label:'ชื่อบริษัท (อังกฤษ)',section:'contact'},
  {key:'contact_address',val:'เลขที่ 15 ถ.กาญจนวณิชย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110',type:'textarea',label:'ที่อยู่',section:'contact'},
  {key:'contact_phone',val:'062-163-9888 , 097-125-8615',type:'text',label:'เบอร์โทรศัพท์',section:'contact'},
  {key:'contact_line',val:'@PSUBlen.official',type:'text',label:'Line ID',section:'contact'},
  {key:'contact_email',val:'psuagrofood.factory@gmail.com',type:'text',label:'Email',section:'contact'},
  {key:'contact_facebook',val:'PSU Blen.official',type:'text',label:'Facebook',section:'contact'},
  {key:'contact_tiktok',val:'PSU Blen.official , psuagrofood.factory',type:'text',label:'TikTok',section:'contact'},
  
  // FOOTER
  {key:'footer_company_th',val:'บริษัท พี เอส ยู อะโกรฟู้ด จำกัด',type:'text',label:'ชื่อบริษัท Footer (ไทย)',section:'footer'},
  {key:'footer_company_en',val:'PSU AGRO FOOD CO., LTD.',type:'text',label:'ชื่อบริษัท Footer (อังกฤษ)',section:'footer'},
  {key:'footer_reg_biz',val:'บริษัท พี เอส ยู อะโกรฟู้ด จำกัด',type:'text',label:'ชื่อธุรกิจ',section:'footer'},
  {key:'footer_reg_type',val:'บริษัท',type:'text',label:'ประเภทนิติบุคคล',section:'footer'},
  {key:'footer_reg_address',val:'เลขที่ 15 ถ.กาญจนวณิชย์ ต.หาดใหญ่ อ.หาดใหญ่ จ.สงขลา 90110',type:'textarea',label:'ที่อยู่จดทะเบียน',section:'footer'},
];

async function insertAllSettings() {
  try {
    console.log('📥 Inserting all settings...\n');
    let count = 0;

    for (const item of allSettings) {
      try {
        // Delete if exists
        await db.execute('DELETE FROM site_settings WHERE setting_key = ?', [item.key]);
        
        // Insert
        await db.execute(
          'INSERT INTO site_settings (setting_key, setting_value, setting_type, section) VALUES (?, ?, ?, ?)',
          [item.key, item.val, item.type, item.section]
        );
        count++;
      } catch (e) {
        console.error(`❌ ${item.key}: ${e.message}`);
      }
    }

    console.log(`\n✅ Inserted ${count}/${allSettings.length} settings`);
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await db.close();
    process.exit(1);
  }
}

insertAllSettings();
