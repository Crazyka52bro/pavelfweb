/**
 * Instalační skript pro aplikaci oprav CMS Pavla Fišera
 * 
 * Tento skript provede:
 * 1. Zálohování stávajících souborů
 * 2. Kopírování opravených souborů
 * 3. Aktualizaci API rout
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cesty k souborům
const ROOT_DIR = path.resolve(__dirname);
const LIB_DIR = path.join(ROOT_DIR, 'lib');
const SERVICES_DIR = path.join(LIB_DIR, 'services');
const API_DIR = path.join(ROOT_DIR, 'app', 'api', 'admin');
const FIXED_API_DIR = path.join(API_DIR, 'fixed');

// Vytvoření záložních adresářů
const BACKUP_DIR = path.join(ROOT_DIR, 'backups');
const BACKUP_LIB_DIR = path.join(BACKUP_DIR, 'lib');
const BACKUP_SERVICES_DIR = path.join(BACKUP_DIR, 'lib', 'services');
const BACKUP_API_DIR = path.join(BACKUP_DIR, 'app', 'api', 'admin');

// Funkce pro vytvoření adresáře, pokud neexistuje
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Vytvořen adresář: ${dir}`);
  }
}

// Funkce pro zálohu souboru
function backupFile(srcFile, destDir) {
  const fileName = path.basename(srcFile);
  const destFile = path.join(destDir, fileName);
  
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Zálohován soubor: ${srcFile} -> ${destFile}`);
    return true;
  } else {
    console.warn(`Varování: Soubor ${srcFile} neexistuje, nelze zálohovat.`);
    return false;
  }
}

// Funkce pro kopírování souboru
function copyFile(srcFile, destFile) {
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Kopírován soubor: ${srcFile} -> ${destFile}`);
    return true;
  } else {
    console.error(`Chyba: Soubor ${srcFile} neexistuje, nelze kopírovat.`);
    return false;
  }
}

// Funkce pro rekurzivní kopírování adresáře
function copyDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.error(`Chyba: Adresář ${srcDir} neexistuje.`);
    return false;
  }
  
  ensureDirectoryExists(destDir);
  
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
  
  return true;
}

// Funkce pro rekurzivní zálohu adresáře
function backupDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`Varování: Adresář ${srcDir} neexistuje, nelze zálohovat.`);
    return false;
  }
  
  ensureDirectoryExists(destDir);
  
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    
    if (entry.isDirectory()) {
      backupDirectory(srcPath, destPath);
    } else {
      backupFile(srcPath, destDir);
    }
  }
  
  return true;
}

// Funkce pro odstranění nepotřebných souborů
function cleanupFiles() {
  // Dočasné soubory oprav
  const filesToRemove = [
    path.join(LIB_DIR, 'auth-utils.ts.new'),
    path.join(LIB_DIR, 'auth-utils.ts.bak'),
    path.join(SERVICES_DIR, 'newsletter-service.ts.new'),
    path.join(SERVICES_DIR, 'newsletter-service.ts.bak'),
    path.join(LIB_DIR, 'newsletter-schema.ts.new'),
    path.join(ROOT_DIR, 'apply-fixes.js.bak'),
    // Další soubory pro čištění projektu
    path.join(ROOT_DIR, '.DS_Store'),
    path.join(ROOT_DIR, 'Thumbs.db'),
    path.join(ROOT_DIR, 'npm-debug.log'),
    path.join(ROOT_DIR, 'yarn-debug.log'),
    path.join(ROOT_DIR, 'yarn-error.log'),
    path.join(ROOT_DIR, 'fix.rar')
  ];

  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Odstraněn soubor: ${file}`);
    }
  });

  // Odstranění dočasných adresářů
  const dirsToRemove = [
    FIXED_API_DIR, 
    path.join(ROOT_DIR, 'node_modules', '.cache'),
    path.join(ROOT_DIR, '.next', 'cache')
  ];

  dirsToRemove.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        fs.rmdirSync(dir, { recursive: true });
        console.log(`Odstraněn adresář: ${dir}`);
      } catch (error) {
        console.warn(`Varování: Nepodařilo se odstranit adresář ${dir}:`, error.message);
      }
    }
  });
}

// Funkce pro vyhledání a odstranění nepoužívaných souborů
function findUnusedFiles() {
  console.log('Hledám nepoužívané soubory...');
  
  try {
    // Seznam souborů, které můžeme bezpečně považovat za nepoužívané nebo zastaralé
    const unusedPatterns = [
      '.tmp',
      '.temp',
      '.bak',
      '.old',
      '.unused',
      'temp-',
      'bak-',
      'backup-'
    ];

    // Projít všechny relevantní adresáře
    const dirsToSearch = [
      path.join(ROOT_DIR, 'app'),
      path.join(ROOT_DIR, 'components'),
      path.join(ROOT_DIR, 'lib'),
      path.join(ROOT_DIR, 'hooks')
    ];
    
    let unusedFiles = [];
    
    // Rekurzivní funkce pro procházení adresářů
    function scanDir(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Přeskočit node_modules, .git a podobné
          if (!['node_modules', '.git', '.next', 'backups'].includes(entry.name)) {
            scanDir(fullPath);
          }
        } else {
          // Zkontrolovat, jestli název souboru odpovídá některému ze vzorů nepoužívaných souborů
          if (unusedPatterns.some(pattern => entry.name.includes(pattern))) {
            unusedFiles.push(fullPath);
          }
        }
      }
    }
    
    // Prohledat všechny adresáře
    dirsToSearch.forEach(scanDir);
    
    // Odstranit nalezené nepoužívané soubory
    if (unusedFiles.length > 0) {
      console.log(`Nalezeno ${unusedFiles.length} nepoužívaných souborů:`);
      
      unusedFiles.forEach(file => {
        console.log(`  - ${file}`);
        try {
          fs.unlinkSync(file);
          console.log(`    Odstraněn soubor: ${file}`);
        } catch (error) {
          console.warn(`    Varování: Nepodařilo se odstranit soubor ${file}:`, error.message);
        }
      });
    } else {
      console.log('Nebyly nalezeny žádné nepoužívané soubory.');
    }
  } catch (error) {
    console.error('Chyba při hledání nepoužívaných souborů:', error);
  }
}

// Funkce pro vyhledání a odstranění duplicitních souborů
function findDuplicateFiles() {
  console.log('Hledám duplicitní soubory...');
  
  try {
    // Mapa pro ukládání hashů souborů
    const fileHashes = new Map();
    const duplicates = [];
    
    // Rekurzivní funkce pro procházení adresářů
    function scanDirForDuplicates(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Přeskočit node_modules, .git a podobné
          if (!['node_modules', '.git', '.next', 'backups', 'data'].includes(entry.name)) {
            scanDirForDuplicates(fullPath);
          }
        } else {
          // Počítat pouze soubory s rozumnou velikostí, abychom nezdržovali proces
          try {
            const stats = fs.statSync(fullPath);
            
            // Přeskočit příliš velké soubory nebo ignorované typy
            if (stats.size > 10 * 1024 * 1024 || // 10 MB
                ['.jpg', '.png', '.gif', '.svg'].some(ext => entry.name.endsWith(ext))) {
              continue;
            }
            
            // Jednoduchý hash na základě velikosti a názvu souboru
            // Pro přesnější detekci duplicitů by se zde mohl použít skutečný hash obsahu
            const simpleHash = `${stats.size}_${entry.name}`;
            
            if (fileHashes.has(simpleHash)) {
              duplicates.push({
                original: fileHashes.get(simpleHash),
                duplicate: fullPath
              });
            } else {
              fileHashes.set(simpleHash, fullPath);
            }
          } catch (error) {
            console.warn(`Varování: Nepodařilo se přečíst soubor ${fullPath}:`, error.message);
          }
        }
      }
    }
    
    // Projít všechny relevantní adresáře
    const dirsToSearch = [
      path.join(ROOT_DIR, 'app'),
      path.join(ROOT_DIR, 'components'),
      path.join(ROOT_DIR, 'lib'),
      path.join(ROOT_DIR, 'hooks')
    ];
    
    dirsToSearch.forEach(scanDirForDuplicates);
    
    // Odstranit nalezené duplicitní soubory
    if (duplicates.length > 0) {
      console.log(`Nalezeno ${duplicates.length} potenciálně duplicitních souborů:`);
      
      duplicates.forEach(({ original, duplicate }) => {
        console.log(`  - Originál: ${original}`);
        console.log(`    Duplicita: ${duplicate}`);
        try {
          // Ukázat, který soubor se odstraňuje (duplicitní)
          fs.unlinkSync(duplicate);
          console.log(`    Odstraněn duplicitní soubor: ${duplicate}`);
        } catch (error) {
          console.warn(`    Varování: Nepodařilo se odstranit soubor ${duplicate}:`, error.message);
        }
      });
    } else {
      console.log('Nebyly nalezeny žádné duplicitní soubory.');
    }
  } catch (error) {
    console.error('Chyba při hledání duplicitních souborů:', error);
  }
}

// Funkce pro vyčištění cache
function cleanBuildCache() {
  console.log('Čistím cache buildu...');
  
  try {
    // Adresáře cache, které můžeme bezpečně smazat
    const cacheDirectories = [
      path.join(ROOT_DIR, '.next'),
      path.join(ROOT_DIR, 'node_modules', '.cache'),
      path.join(ROOT_DIR, '.vercel', 'output'),
      path.join(ROOT_DIR, '.cache')
    ];
    
    cacheDirectories.forEach(dir => {
      if (fs.existsSync(dir)) {
        try {
          fs.rmdirSync(dir, { recursive: true });
          console.log(`Odstraněn cache adresář: ${dir}`);
        } catch (error) {
          console.warn(`Varování: Nepodařilo se odstranit adresář ${dir}:`, error.message);
        }
      }
    });
    
    console.log('Cache buildu vyčištěna.');
  } catch (error) {
    console.error('Chyba při čištění cache buildu:', error);
  }
}

// Hlavní funkce
async function main() {
  try {
    console.log('Začínám aplikaci oprav CMS Pavla Fišera...');
    
    // Vytvoření záložních adresářů
    console.log('\n1. Vytváření záložních adresářů...');
    ensureDirectoryExists(BACKUP_DIR);
    ensureDirectoryExists(BACKUP_LIB_DIR);
    ensureDirectoryExists(BACKUP_SERVICES_DIR);
    ensureDirectoryExists(BACKUP_API_DIR);
    
    // Zálohování souborů
    console.log('\n2. Zálohování stávajících souborů...');
    backupFile(path.join(LIB_DIR, 'auth-utils.ts'), BACKUP_LIB_DIR);
    backupFile(path.join(SERVICES_DIR, 'newsletter-service.ts'), BACKUP_SERVICES_DIR);
    backupDirectory(API_DIR, BACKUP_API_DIR);
    
    // Kopírování opravených souborů
    console.log('\n3. Aplikace opravených souborů...');
    copyFile(path.join(LIB_DIR, 'auth-utils.ts.new'), path.join(LIB_DIR, 'auth-utils.ts'));
    copyFile(path.join(SERVICES_DIR, 'newsletter-service.ts.new'), path.join(SERVICES_DIR, 'newsletter-service.ts'));
    copyFile(path.join(LIB_DIR, 'newsletter-schema.ts'), path.join(LIB_DIR, 'newsletter-schema.ts'));
    
    // Kopírování opravených API rout
    console.log('\n4. Aktualizace API rout...');
    if (fs.existsSync(FIXED_API_DIR)) {
      copyDirectory(FIXED_API_DIR, API_DIR);
    } else {
      console.error(`Chyba: Adresář ${FIXED_API_DIR} neexistuje.`);
    }
    
    // Odstranění nepotřebných souborů
    console.log('\n5. Čištění nepotřebných souborů...');
    cleanupFiles();
    
    // Vyhledání a odstranění nepoužívaných souborů
    console.log('\n6. Vyhledání a odstranění nepoužívaných souborů...');
    findUnusedFiles();
    
    // Vyhledání a odstranění duplicitních souborů
    console.log('\n7. Vyhledání a odstranění duplicitních souborů...');
    findDuplicateFiles();
    
    // Vyčištění cache buildu
    console.log('\n8. Čištění cache buildu...');
    cleanBuildCache();
    
    console.log('\nOpravy a čištění byly úspěšně provedeny!');
    console.log('Všechny původní soubory byly zálohovány v adresáři backups/');
    console.log('Nepotřebné, nepoužívané a duplicitní soubory byly odstraněny.');
    console.log('Cache buildu byla vyčištěna pro čistou instalaci.');
    console.log('\nDoporučuji spustit `npm run dev` pro ověření, že vše funguje správně.');
  } catch (error) {
    console.error('Došlo k chybě během aplikace oprav:', error);
    process.exit(1);
  }
}

// Spuštění hlavní funkce
main();
