/**
 * Automatická záloha databáze
 * 
 * Tento skript vytvoří zálohu všech tabulek v databázi do JSON souborů.
 * Zálohy jsou uloženy do adresáře data/backups s časovým razítkem.
 * 
 * Použití:
 * pnpm tsx scripts/backup-database.mjs
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Načtení proměnných prostředí
dotenv.config();

// Získání cest k souborům
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Klient pro připojení k Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL);

// Adresář pro zálohy
const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
const BACKUP_FOLDER = path.join(rootDir, 'data', 'backups', timestamp);

/**
 * Pomocná funkce pro získání seznamu všech tabulek v databázi
 * @returns {Promise<string[]>} Seznam tabulek
 */
async function getAllTables() {
  try {
    const result = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    return result.map(row => row.table_name);
  } catch (error) {
    console.error('❌ Chyba při získávání seznamu tabulek:', error);
    return [];
  }
}

/**
 * Vytvoření zálohy jedné tabulky
 * @param {string} tableName Název tabulky
 * @returns {Promise<string|null>} Cesta k souboru se zálohou nebo null při chybě
 */
async function backupTable(tableName) {
  try {
    console.log(`📑 Zálohování tabulky ${tableName}...`);
    
    // Získání dat z tabulky
    const data = await sql.raw(`SELECT * FROM ${tableName}`);
    
    // Vytvoření souboru se zálohou
    const fileName = `${tableName}.json`;
    const filePath = path.join(BACKUP_FOLDER, fileName);
    
    await fs.mkdir(BACKUP_FOLDER, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    console.log(`✅ Záloha tabulky ${tableName} uložena (${data.length} záznamů)`);
    return filePath;
  } catch (error) {
    console.error(`❌ Chyba při zálohování tabulky ${tableName}:`, error);
    return null;
  }
}

/**
 * Vytvoření souboru s metadaty zálohy
 * @param {Object} metadata Metadata o záloze
 * @returns {Promise<void>}
 */
async function createBackupMetadata(metadata) {
  try {
    const metadataPath = path.join(BACKUP_FOLDER, '_metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log('📋 Metadata zálohy byla uložena');
  } catch (error) {
    console.error('❌ Chyba při ukládání metadat:', error);
  }
}

/**
 * Hlavní funkce pro zálohování celé databáze
 */
async function main() {
  console.log(`🚀 Zahájení zálohování databáze v ${timestamp}...`);
  console.log(`📁 Zálohy budou uloženy do: ${BACKUP_FOLDER}`);
  
  try {
    // Získání seznamu všech tabulek
    const tables = await getAllTables();
    
    if (tables.length === 0) {
      console.warn('⚠️ Nenalezeny žádné tabulky k zálohování');
      return;
    }
    
    console.log(`🔍 Nalezeno ${tables.length} tabulek: ${tables.join(', ')}`);
    
    // Zálohování všech tabulek
    const results = [];
    for (const table of tables) {
      const filePath = await backupTable(table);
      
      if (filePath) {
        results.push({
          table,
          path: filePath,
          success: true
        });
      } else {
        results.push({
          table,
          success: false
        });
      }
    }
    
    // Vytvoření metadat o záloze
    const metadata = {
      timestamp,
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@'), // maskování hesla
      tablesCount: tables.length,
      successCount: results.filter(r => r.success).length,
      failedCount: results.filter(r => !r.success).length,
      tables: results.map(r => ({
        name: r.table,
        success: r.success
      }))
    };
    
    await createBackupMetadata(metadata);
    
    console.log('✨ Zálohování dokončeno');
    console.log(`📊 Výsledek: ${metadata.successCount}/${metadata.tablesCount} tabulek úspěšně zálohováno`);
  } catch (error) {
    console.error('❌ Kritická chyba při zálohování:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Neočekávaná chyba:', error);
  process.exit(1);
});
