const db = require('./models/db');

(async () => {
  try {
    const columns = await db.execute('DESCRIBE site_settings');
    console.log('Table schema:');
    console.log(JSON.stringify(columns, null, 2));
    process.exit(0);
  } catch(err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
