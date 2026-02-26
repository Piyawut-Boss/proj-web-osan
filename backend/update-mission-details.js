const db = require('./models/db');

const missionUpdates = [
  {
    key: 'mission_item1_desc',
    value: 'พัฒนานวัตกรรมอาหารเพื่อสุขภาพ ..... เพื่อชีวิตที่ดีกว่า'
  },
  {
    key: 'mission_item2_desc',
    value: 'เราคือผู้นำนวัตกรรมอาหารเพื่อสุขภาพของประเทศไทย\nและเป็นแหล่งเรียนรู้ บูรณาการการเรียนและการวิจัย'
  },
  {
    key: 'mission_item3_desc',
    value: 'สนับสนุนและพัฒนาความสามารถของพนักงานให้\nมีความเป็นมืออาชีพ สร้างคุณภาพชีวิตที่ดี'
  },
  {
    key: 'mission_item4_desc',
    value: 'ใช้นวัตกรรมสร้างธุรกิจเพื่อเพิ่มประสิทธิภาพการจัดการ\nและต่อยอดสู่ผลประกอบการที่ดี'
  }
];

async function updateMissionDetails() {
  try {
    console.log('🚀 Updating mission details...');
    
    for (const item of missionUpdates) {
      await db.execute(
        'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
        [item.value, item.key]
      );
      console.log(`✅ Updated: ${item.key}`);
    }
    
    console.log('\n✨ All mission details updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating mission details:', err.message);
    process.exit(1);
  }
}

updateMissionDetails();
