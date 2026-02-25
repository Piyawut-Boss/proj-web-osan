const mysql = require('mysql2/promise');

async function resetPassword() {
  try {
    // Try connection without password first (as shown in installation)
    let connection;
    try {
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
      });
      console.log('✅ Connected with empty password');
    } catch (err) {
      // If that fails, try with 'mysql' as a fallback
      try {
        connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'mysql',
          port: 3306,
        });
        console.log('✅ Connected with password "mysql"');
      } catch (err2) {
        // Last resort - try without authentication
        connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          port: 3306,
          connectionTimeout: 5000,
        });
      }
    }

    // Set password
    await connection.execute("ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123'");
    console.log('✅ MySQL root password set to: root123');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.log('⚠️  Could not reset password:', error.message);
    console.log('Continuing anyway - will attempt init with different credentials');
    process.exit(0);
  }
}

resetPassword();
