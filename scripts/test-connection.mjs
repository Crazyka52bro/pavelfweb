/**
 * Test připojení k Neon PostgreSQL databázi
 * 
 * Tento skript otestuje připojení k databázi a vypíše základní informace.
 * 
 * Použití:
 * pnpm tsx scripts/test-connection.mjs
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Načtení proměnných prostředí
dotenv.config();

// Získání cest k souborům
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '..', 'package.json');

// Klient pro připojení k Neon PostgreSQL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Chyba: Proměnná prostředí DATABASE_URL není nastavena!');
  console.log('   Ujistěte se, že máte správně nakonfigurovaný soubor .env nebo .env.local');
  process.exit(1);
}

/**
 * Hlavní funkce pro testování připojení k databázi
 */
async function main() {
  try {
    console.log('🔄 Testování připojení k databázi...');
    
    // Zkrácené URL pro výpis (bez hesla)
    const maskedUrl = connectionString.replace(/:[^:]*@/, ':***@');
    console.log(`🔗 Připojuji k: ${maskedUrl}`);
    
    // Vytvoření klienta Neon
    const sql = neon(connectionString);
    
    // Test připojení jednoduchým dotazem
    const startTime = Date.now();
    const result = await sql`SELECT current_database() as db_name, current_user as user_name, version() as pg_version`;
    const endTime = Date.now();
    
    console.log('✅ Připojení úspěšné!');
    console.log(`⏱️  Doba odezvy: ${endTime - startTime}ms`);
    
    // Výpis informací o databázi
    const dbInfo = result[0];
    console.log('\n📊 Informace o databázi:');
    console.log(`   Název databáze: ${dbInfo.db_name}`);
    console.log(`   Uživatel: ${dbInfo.user_name}`);
    console.log(`   PostgreSQL verze: ${dbInfo.pg_version.split(' on ')[0]}`);
    
    // Získání seznamu tabulek
    const tables = await sql`
      SELECT table_name, 
             (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    console.log(`\n📋 Seznam tabulek (celkem: ${tables.length}):`);
    
    if (tables.length === 0) {
      console.log('   Žádné tabulky nebyly nalezeny');
    } else {
      // Výpis seznamu tabulek
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name} (${table.columns_count} sloupců)`);
      });
    }
    
    // Výpis závislostí projektu
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      console.log('\n📦 Nainstalované databázové závislosti:');
      
      const dbDependencies = [
        '@neondatabase/serverless',
        'pg',
        'postgres',
        'drizzle-orm',
        'dotenv',
        'bcrypt'
      ];
      
      dbDependencies.forEach(dep => {
        if (dependencies[dep]) {
          console.log(`   ✓ ${dep}: ${dependencies[dep]}`);
        } else {
          console.log(`   ✗ ${dep}: není nainstalováno`);
        }
      });
    } catch (error) {
      console.error('⚠️ Nepodařilo se načíst package.json:', error.message);
    }
    
    console.log('\n🎉 Test připojení byl úspěšně dokončen!');
  } catch (error) {
    console.error('❌ Chyba při připojení k databázi:');
    console.error(error);
    
    // Kontrola běžných chyb
    if (error.message.includes('getaddrinfo')) {
      console.log('\n⚠️ Tip: Zkontrolujte správnost hostitele v DATABASE_URL a připojení k internetu');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️ Tip: Zkontrolujte správnost uživatelského jména a hesla v DATABASE_URL');
    } else if (error.message.includes('database does not exist')) {
      console.log('\n⚠️ Tip: Databáze neexistuje. Zkontrolujte název databáze nebo ji nejprve vytvořte');
    }
    
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Neočekávaná chyba:', error);
  process.exit(1);
});
