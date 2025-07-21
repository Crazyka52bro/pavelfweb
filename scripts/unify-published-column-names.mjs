// unify-published-column-names.mjs
import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

async function unifyPublishedColumnNames() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('🔄 Zjišťování stavu sloupců v tabulce articles...');
    
    // Kontrola, zda v tabulce articles existuje sloupec 'published'
    const publishedExists = await sql`
      SELECT EXISTS (
        SELECT FROM pg_attribute 
        WHERE attrelid = 'articles'::regclass
        AND attname = 'published' 
        AND NOT attisdropped
      ) as exists
    `;
    
    // Kontrola, zda v tabulce articles existuje sloupec 'is_published'
    const isPublishedExists = await sql`
      SELECT EXISTS (
        SELECT FROM pg_attribute 
        WHERE attrelid = 'articles'::regclass
        AND attname = 'is_published' 
        AND NOT attisdropped
      ) as exists
    `;
    
    console.log(`Stav sloupců v tabulce articles:
      - published: ${publishedExists[0].exists ? 'existuje' : 'neexistuje'}
      - is_published: ${isPublishedExists[0].exists ? 'existuje' : 'neexistuje'}
    `);
    
    // Řešení konfliktu mezi sloupci published a is_published
    if (publishedExists[0].exists && !isPublishedExists[0].exists) {
      // Pokud existuje pouze 'published', přejmenujeme ho na 'is_published'
      console.log('🔄 Přejmenovávám sloupec published na is_published...');
      await sql`ALTER TABLE articles RENAME COLUMN published TO is_published`;
      console.log('✅ Sloupec úspěšně přejmenován.');
    } 
    else if (!publishedExists[0].exists && isPublishedExists[0].exists) {
      // Pokud existuje pouze 'is_published', ponecháme ho
      console.log('✅ Sloupec is_published již existuje, není potřeba nic měnit.');
    }
    else if (publishedExists[0].exists && isPublishedExists[0].exists) {
      // Pokud existují oba sloupce, zkopírujeme data a odstraníme starý sloupec
      console.log('⚠️ Nalezeny oba sloupce published a is_published. Kopíruji data a odstraňuji published...');
      
      await sql`
        UPDATE articles 
        SET is_published = published 
        WHERE is_published IS NULL
      `;
      
      await sql`ALTER TABLE articles DROP COLUMN published`;
      
      console.log('✅ Data zkopírována a sloupec published odstraněn.');
    }
    else {
      // Pokud neexistuje ani jeden sloupec, vytvoříme is_published
      console.log('🔄 Vytvářím sloupec is_published...');
      await sql`ALTER TABLE articles ADD COLUMN is_published BOOLEAN DEFAULT FALSE`;
      console.log('✅ Sloupec is_published vytvořen.');
    }
    
    console.log('🎉 Sjednocení názvů sloupců dokončeno.');
  } catch (error) {
    console.error('❌ Chyba při sjednocování názvů sloupců:', error);
    process.exit(1);
  }
}

// Spuštění, pokud je skript volán přímo
if (import.meta.url === import.meta.main) {
  unifyPublishedColumnNames();
}

export { unifyPublishedColumnNames };
