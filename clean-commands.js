/**
 * Pomocné příkazy pro čištění a optimalizaci projektu
 * Tyto příkazy lze spustit manuálně nebo je použít v rámci skriptů pro údržbu
 */

const cleanCommands = {
  // Příkazy pro Next.js cache
  nextjs: {
    // Vyčistí výstupní složku buildu
    cleanBuild: "rimraf .next",
    // Vyčistí vyrovnávací paměť cache
    cleanCache: "rimraf .next/cache",
    // Kompletní čištění a nový build
    rebuildFresh: "rimraf .next && next build"
  },
  
  // Příkazy pro Node.js moduly a závislosti
  dependencies: {
    // Vyčistí node_modules
    cleanNodeModules: "rimraf node_modules",
    // Vyčistí cache npm/pnpm
    cleanPackageCache: "pnpm cache clean",
    // Čistá instalace závislostí (bez použití cache)
    freshInstall: "rimraf node_modules && pnpm install --force"
  },
  
  // Databázové příkazy pro čistý restart
  database: {
    // Reset databáze a nové nastavení
    resetDatabase: "node scripts/complete-setup.mjs",
    // Záloha aktuálních dat
    backupData: "node scripts/backup-data.js"
  },
  
  // Čištění vývojových souborů
  development: {
    // Odstranění dočasných a ladících souborů
    cleanTemp: "rimraf .temp *.log",
    // Čištění TypeScript cache
    cleanTsCache: "rimraf tsconfig.tsbuildinfo",
  },
  
  // Kombinované příkazy pro různé situace
  combined: {
    // Úplné vyčištění projektu (vše kromě záloh)
    deepClean: "rimraf .next node_modules tsconfig.tsbuildinfo *.log .temp",
    // Kompletní restart s čistou instalací
    fullReset: "rimraf .next node_modules tsconfig.tsbuildinfo && pnpm install && node scripts/complete-setup.mjs"
  }
};

module.exports = cleanCommands;

/**
 * Použití v Node.js skriptu:
 * 
 * const cleanCommands = require('./clean-commands');
 * const { exec } = require('child_process');
 * 
 * // Příklad: Vyčištění Next.js cache
 * exec(cleanCommands.nextjs.cleanCache, (err, stdout, stderr) => {
 *   if (err) {
 *     console.error('Chyba při čištění cache:', err);
 *     return;
 *   }
 *   console.log('Next.js cache byla úspěšně vyčištěna!');
 * });
 */
