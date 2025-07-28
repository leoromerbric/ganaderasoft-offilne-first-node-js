const { pool } = require('../config/database');

const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database query test successful:', rows[0]);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

const checkTables = async () => {
  try {
    console.log('\nChecking required tables...');
    const connection = await pool.getConnection();
    
    // Check if required tables exist
    const tables = ['users', 'propietario', 'finca'];
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SHOW TABLES LIKE '${table}'`);
        if (rows.length > 0) {
          console.log(`✅ Table '${table}' exists`);
        } else {
          console.log(`❌ Table '${table}' does not exist`);
        }
      } catch (error) {
        console.log(`❌ Error checking table '${table}':`, error.message);
      }
    }
    
    connection.release();
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
};

const createSampleData = async () => {
  try {
    console.log('\nCreating sample data...');
    const connection = await pool.getConnection();
    
    // Check if users exist
    const [userRows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count > 0) {
      console.log('✅ Users already exist, skipping sample data creation');
      connection.release();
      return;
    }
    
    // Create sample users
    await connection.execute(`
      INSERT INTO users (name, email, password, type_user, created_at, updated_at) VALUES
      ('Admin User', 'admin@ganaderasoft.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NOW(), NOW()),
      ('Juan Pérez', 'juan@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', NOW(), NOW())
    `);
    
    // Create sample propietarios
    await connection.execute(`
      INSERT INTO propietario (id, Nombre, Apellido, Telefono, archivado, created_at, updated_at) VALUES
      (2, 'Juan', 'Pérez', '1234567890', 0, NOW(), NOW())
    `);
    
    // Create sample fincas
    await connection.execute(`
      INSERT INTO finca (id_Propietario, Nombre, Explotacion_Tipo, archivado, created_at, updated_at) VALUES
      (2, 'Finca San José', 'Bovinos', 0, NOW(), NOW()),
      (2, 'Finca El Paraíso', 'Bufalos', 0, NOW(), NOW())
    `);
    
    console.log('✅ Sample data created successfully');
    console.log('📝 Sample credentials:');
    console.log('   Admin: admin@ganaderasoft.com / password');
    console.log('   User:  juan@example.com / password');
    
    connection.release();
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
  }
};

const main = async () => {
  console.log('🔧 Database Setup Utility\n');
  
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('\n❌ Cannot proceed without database connection');
    process.exit(1);
  }
  
  await checkTables();
  await createSampleData();
  
  console.log('\n✅ Database setup completed');
  process.exit(0);
};

if (require.main === module) {
  main();
}

module.exports = {
  testConnection,
  checkTables,
  createSampleData
};