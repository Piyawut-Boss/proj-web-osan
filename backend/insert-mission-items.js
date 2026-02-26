const db = require('./models/db');

const missionItems = [
  {
    key: 'mission_item1_title',
    value: 'ต่อลูกค้า',
    type: 'text',
    section: 'mission'
  },
  {
    key: 'mission_item1_desc',
    value: 'พัฒนานวัตกรรมอาหารเพื่อสุขภาพ\nเพื่อชีวิตที่ดีกว่า',
    type: 'textarea',
    section: 'mission'
  },
  {
    key: 'mission_item2_title',
    value: 'ต่อสังคม',
    type: 'text',
    section: 'mission'
  },
  {
    key: 'mission_item2_desc',
    value: 'เราคือผู้นำนวัตกรรมอาหารเพื่อสุขภาพของประเทศไทย\nและเป็นแหล่งเรียนรู้ บูรณาการการเรียนและการวิจัย',
    type: 'textarea',
    section: 'mission'
  },
  {
    key: 'mission_item3_title',
    value: 'ต่อพนักงาน',
    type: 'text',
    section: 'mission'
  },
  {
    key: 'mission_item3_desc',
    value: 'สนับสนุนและพัฒนาความสามารถของพนักงานให้\nมีความเป็นมืออาชีพ สร้างคุณภาพชีวิตที่ดี',
    type: 'textarea',
    section: 'mission'
  },
  {
    key: 'mission_item4_title',
    value: 'ต่อผู้ถือหุ้น',
    type: 'text',
    section: 'mission'
  },
  {
    key: 'mission_item4_desc',
    value: 'ใช้นวัตกรรมสร้างธุรกิจเพื่อเพิ่มประสิทธิภาพการจัดการ\nและต่อยอดสู่ผลประกอบการที่ดี',
    type: 'textarea',
    section: 'mission'
  }
];

async function insertMissionItems() {
  try {
    console.log('🚀 Inserting mission items...\n');

    for (const item of missionItems) {
      try {
        // Try to delete if exists (in case of duplicate key)
        await db.execute(
          'DELETE FROM site_settings WHERE setting_key = ?',
          [item.key]
        );
      } catch (e) {
        // Ignore delete errors
      }

      // Insert the mission item (without label column)
      const [result] = await db.execute(
        'INSERT INTO site_settings (setting_key, setting_value, setting_type, section) VALUES (?, ?, ?, ?)',
        [item.key, item.value, item.type, item.section]
      );
      
      console.log(`✅ Inserted: ${item.key}`);
    }

    console.log('\n✨ All mission items inserted successfully!');
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await db.close();
    process.exit(1);
  }
}

insertMissionItems();
