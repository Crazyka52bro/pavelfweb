/**
 * Vytvoření tabulky users_sync, pokud neexistuje
 * 
 * Tento skript vytvoří tabulku users_sync, která je potřebná pro správnou funkci aplikace.
 */

import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(connectionString);

/**
 * Kontrola existence tabulky
 * @param {string} tableName - Název tabulky
 * @returns {Promise<boolean>} - true pokud tabulka existuje, jinak false
 */
async function tableExists(tableName) {
  const result = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
    ) AS exists
  `;
  return result[0].exists;
}

/**
 * Vytvoření tabulky users_sync, pokud neexistuje
 */
async function createUsersSyncTable() {
  try {
    console.log('🚀 Starting users_sync table setup...');
    
    const exists = await tableExists('users_sync');
    
    if (!exists) {
      console.log('📝 Creating users_sync table...');
      
      await sql`
        CREATE TABLE users_sync (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          hashed_password TEXT NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          name TEXT,
          last_login TIMESTAMP
        )
      `;
      
      await sql`CREATE INDEX idx_users_sync_email ON users_sync(email)`;
      
      console.log('✅ users_sync table created successfully');
      
      // Vytvoření admin uživatele, pokud jsou nastavené proměnné prostředí
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
        console.log(`👤 Creating admin user ${process.env.ADMIN_EMAIL}...`);
        
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        await sql`
          INSERT INTO users_sync (email, hashed_password, is_admin, name)
          VALUES (${process.env.ADMIN_EMAIL}, ${hashedPassword}, true, 'Administrator')
          ON CONFLICT (email) DO NOTHING
        `;
        
        console.log('✅ Admin user created');
      } else {
        console.log('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin user creation');
      }
    } else {
      console.log('✅ users_sync table already exists');
    }
    
    console.log('🎉 Setup completed successfully!');
  } catch (error) {
    console.error('❌ Error creating users_sync table:', error);
    process.exit(1);
  }
}

// Spuštění skriptu
createUsersSyncTable();
