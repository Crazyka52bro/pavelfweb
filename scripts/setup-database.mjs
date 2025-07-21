// setup-database.mjs
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import 'dotenv/config'

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    console.log('🔄 Setting up database connection...');
    
    // Zkusíme provést jednoduchý dotaz pro ověření připojení
    const result = await sql`SELECT version()`;
    console.log(`✅ Connected to PostgreSQL version: ${result[0].version}`);
    
    // Vytvoření minimální struktury DB
    console.log('📋 Creating basic table structure...');
    
    // Vytvoření základní tabulky articles, pokud ještě neexistuje
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(512) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category VARCHAR(128) NOT NULL,
        tags TEXT[],
        is_published BOOLEAN DEFAULT FALSE,
        image_url VARCHAR(2048),
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(128) NOT NULL
      )
    `;
    console.log('✅ Articles table created or already exists');
    
    // Vytvoření základní tabulky categories, pokud ještě neexistuje
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        color VARCHAR(7),
        icon VARCHAR(255),
        parent_id UUID,
        display_order VARCHAR(255) DEFAULT '0',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Categories table created or already exists');
    
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Spuštění setupu, pokud je skript volán přímo
if (import.meta.url === import.meta.main) {
  setupDatabase();
}

export { setupDatabase };
