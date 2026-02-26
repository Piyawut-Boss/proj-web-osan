const db = require('./models/db');

(async () => {
  try {
    const [rows] = await db.execute('SELECT setting_key, setting_type, section FROM site_settings WHERE section IN ("showcase", "mealbox") ORDER BY section, setting_key');
    console.log('Settings found:');
    console.log(JSON.stringify(rows, null, 2));
  } catch(err) {
    console.log('ERROR:', err.message);
  }
  process.exit(0);
})();
