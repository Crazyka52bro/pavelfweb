/**
 * Sjednocení názvů sloupců v databázi
 * 
 * Tento skript sjednocuje názvy sloupců `published` na `is_published`
 * pro zajištění konzistentního pojmenování napříč všemi tabulkami.
 * 
 * Použití:
 * pnpm tsx scripts/unify-published-columns.mjs
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Načtení proměnných prostředí
dotenv.config();

// Klient pro připojení k Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL);

/**
 * Kontrola existence sloupce v tabulce
 * @param {string} tableName Název tabulky
 * @param {string} columnName Název sloupce
 * @returns {Promise<boolean>} true pokud sloupec existuje, jinak false
 */
async function columnExists(tableName, columnName) {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = ${tableName}
        AND column_name = ${columnName}
      ) AS exists
    `;
    return result[0].exists;
  } catch (error) {
    console.error(`❌ Chyba při kontrole existence sloupce ${columnName} v tabulce ${tableName}:`, error);
    return false;
  }
}

/**
 * Přejmenování sloupce v tabulce
 * @param {string} tableName Název tabulky
 * @param {string} oldColumnName Starý název sloupce
 * @param {string} newColumnName Nový název sloupce
 * @returns {Promise<boolean>} true pokud bylo přejmenování úspěšné, jinak false
 */
async function renameColumn(tableName, oldColumnName, newColumnName) {
  try {
    await sql.raw(`ALTER TABLE ${tableName} RENAME COLUMN ${oldColumnName} TO ${newColumnName}`);
    console.log(`✅ Sloupec v tabulce ${tableName} byl přejmenován z '${oldColumnName}' na '${newColumnName}'`);
    return true;
  } catch (error) {
    console.error(`❌ Chyba při přejmenování sloupce v tabulce ${tableName}:`, error);
    return false;
  }
}

/**
 * Nalezení všech tabulek se sloupcem 'published' nebo 'is_published'
 * @returns {Promise<Array<{tableName: string, hasPublished: boolean, hasIsPublished: boolean}>>}
 */
async function findTablesWithPublishedColumn() {
  try {
    const allTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;
    
    const results = [];
    
    for (const { table_name } of allTables) {
      const hasPublished = await columnExists(table_name, 'published');
      const hasIsPublished = await columnExists(table_name, 'is_published');
      
      if (hasPublished || hasIsPublished) {
        results.push({
          tableName: table_name,
          hasPublished,
          hasIsPublished
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('❌ Chyba při hledání tabulek s publikačním sloupcem:', error);
    return [];
  }
}

/**
 * Hlavní funkce skriptu
 */
async function main() {
  console.log('🚀 Zahájení sjednocení názvů sloupců...');
  
  try {
    // Nalezení všech tabulek s publikačním sloupcem
    const tables = await findTablesWithPublishedColumn();
    
    if (tables.length === 0) {
      console.log('ℹ️ Žádné tabulky s publikačním sloupcem nebyly nalezeny');
      return;
    }
    
    console.log(`🔍 Nalezeno ${tables.length} tabulek s publikačním sloupcem:`);
    
    for (const table of tables) {
      console.log(`   - ${table.tableName}: published=${table.hasPublished}, is_published=${table.hasIsPublished}`);
      
      if (table.hasPublished && !table.hasIsPublished) {
        // Přejmenování z 'published' na 'is_published'
        await renameColumn(table.tableName, 'published', 'is_published');
      } else if (table.hasPublished && table.hasIsPublished) {
        console.warn(`⚠️ Tabulka ${table.tableName} má oba sloupce ('published' i 'is_published')!`);
        console.log('   Bude potřeba ruční kontrola a migrace dat');
      }
    }
    
    console.log('✨ Sjednocení názvů sloupců dokončeno');
  } catch (error) {
    console.error('❌ Kritická chyba při sjednocení názvů sloupců:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Neočekávaná chyba:', error);
  process.exit(1);
});
