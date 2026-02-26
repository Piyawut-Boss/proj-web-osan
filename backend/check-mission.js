const db = require('./models/db');

async function checkMission() {
  try {
    console.log('\n📋 Checking mission settings in database...\n');
    
    // Query the settings
    const [rows] = await db.execute('SELECT setting_key, setting_value, setting_type FROM site_settings WHERE setting_key LIKE ? ORDER BY setting_key', ['mission_item%']);
    
    if (rows.length === 0) {
      console.log('❌ No mission settings found in database!');
      console.log('   Settings keys to create: mission_item1_desc, mission_item2_desc, mission_item3_desc, mission_item4_desc');
    } else {
      console.log(`✅ Found ${rows.length} mission settings:\n`);
      rows.forEach(row => {
        const val = row.setting_value || '(empty)';
        const display = val.length > 80 ? val.substring(0, 80) + '...' : val;
        console.log(`  📌 ${row.setting_key}`);
        console.log(`     Type: ${row.setting_type}`);
        console.log(`     Value: ${display}\n`);
      });
    }
    
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    await db.close();
    process.exit(1);
  }
}

checkMission();
