
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Vytvoření Neon klienta - není potřeba connect() a end()
const sql = neon(connectionString);

// Helper pro bezpečné spuštění SQL souboru (rozdělí na jednotlivé příkazy)
async function runSqlFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    console.log(`📄 Načítání SQL souboru: ${filePath}...`);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ SQL soubor nenalezen: ${filePath}`);
      return false;
    }
    
    const sqlContent = fs.readFileSync(fullPath, 'utf8');
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Provádění ${statements.length} SQL příkazů...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        // Použijeme template string pro každý příkaz zvlášť
        await sql`${statement}`;
      } catch (error) {
        // Pokud je chyba "already exists", jen ji zalogujeme a pokračujeme
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️ Přeskočeno (již existuje): ${error.message}`);
        } else {
          throw error;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Chyba při spouštění SQL souboru: ${error.message}`);
    return false;
  }
}

// Kontrola existence tabulky
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

// Spustit SQL příkaz bezpečně (ošetřená chyba, pokud tabulka existuje)
async function executeSafely(description, statement) {
  console.log(`🔹 ${description}...`);
  try {
    await sql`${statement}`;
    console.log(`   ✅ Hotovo`);
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log(`   ⚠️ Přeskočeno (již existuje): ${error.message}`);
      return true;
    } else {
      console.error(`   ❌ Chyba: ${error.message}`);
      return false;
    }
  }
}

(async () => {
  try {
    console.log('🚀 Starting database setup...');

    // Vytvoření tabulek
    await executeSafely('Vytváření tabulky articles', `
      CREATE TABLE IF NOT EXISTS articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        category TEXT,
        image_url TEXT,
        is_published BOOLEAN DEFAULT TRUE
      )
    `);

    await executeSafely('Vytváření tabulky subscribers', `
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT NOW(),
        unsubscribed_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        subscription_source TEXT,
        token TEXT
      )
    `);

    await executeSafely('Vytváření tabulky campaigns', `
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await executeSafely('Vytváření tabulky sent_emails', `
      CREATE TABLE IF NOT EXISTS sent_emails (
        id SERIAL PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        subscriber_id INTEGER REFERENCES subscribers(id),
        sent_at TIMESTAMP DEFAULT NOW(),
        status TEXT,
        error TEXT
      )
    `);

    await executeSafely('Vytváření tabulky campaign_stats', `
      CREATE TABLE IF NOT EXISTS campaign_stats (
        id SERIAL PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        sent_count INTEGER DEFAULT 0,
        delivered_count INTEGER DEFAULT 0,
        open_count INTEGER DEFAULT 0,
        click_count INTEGER DEFAULT 0,
        unsubscribe_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await executeSafely('Vytváření tabulky email_templates', `
      CREATE TABLE IF NOT EXISTS email_templates (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await executeSafely('Vytváření tabulky categories', `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await executeSafely('Vytváření tabulky settings', `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Vytvoření indexů
    await executeSafely('Vytváření indexu idx_articles_category', `CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`);
    await executeSafely('Vytváření indexu idx_articles_created_at', `CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at)`);
    await executeSafely('Vytváření indexu idx_subscribers_email', `CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email)`);
    await executeSafely('Vytváření indexu idx_subscribers_is_active', `CREATE INDEX IF NOT EXISTS idx_subscribers_is_active ON subscribers(is_active)`);
    await executeSafely('Vytváření indexu idx_campaigns_sent_at', `CREATE INDEX IF NOT EXISTS idx_campaigns_sent_at ON campaigns(sent_at)`);
    await executeSafely('Vytváření indexu idx_sent_emails_campaign_id', `CREATE INDEX IF NOT EXISTS idx_sent_emails_campaign_id ON sent_emails(campaign_id)`);
    await executeSafely('Vytváření indexu idx_sent_emails_subscriber_id', `CREATE INDEX IF NOT EXISTS idx_sent_emails_subscriber_id ON sent_emails(subscriber_id)`);
    await executeSafely('Vytváření indexu idx_campaign_stats_campaign_id', `CREATE INDEX IF NOT EXISTS idx_campaign_stats_campaign_id ON campaign_stats(campaign_id)`);
    await executeSafely('Vytváření indexu idx_email_templates_name', `CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name)`);

    // Vytvoření tabulky users_sync
    await executeSafely('Vytváření tabulky users_sync', `
      CREATE TABLE IF NOT EXISTS users_sync (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        name TEXT,
        last_login TIMESTAMP
      )
    `);

    await executeSafely('Vytváření indexu idx_users_sync_email', `CREATE INDEX IF NOT EXISTS idx_users_sync_email ON users_sync(email)`);

    // Přidání ukázkového admin uživatele (pokud ještě neexistuje)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      console.log('🔑 Kontrola admin uživatele...');
      
      // Kontrola, zda už admin neexistuje
      const existingAdmin = await sql`
        SELECT * FROM users_sync 
        WHERE email = ${process.env.ADMIN_EMAIL} 
        AND is_admin = true
        LIMIT 1
      `;
      
      if (existingAdmin.length === 0) {
        console.log(`👤 Vytváření admin uživatele ${process.env.ADMIN_EMAIL}...`);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        await sql`
          INSERT INTO users_sync (email, hashed_password, is_admin, name)
          VALUES (${process.env.ADMIN_EMAIL}, ${hashedPassword}, true, 'Administrator')
        `;
        
        console.log('✅ Admin uživatel vytvořen');
      } else {
        console.log('✅ Admin uživatel již existuje');
      }
    }

    console.log('✅ Database schema created successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
})();
