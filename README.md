# Pavel Fišer CMS - Database Standardizace

## Přehled změn

Byly provedeny následující změny pro standardizaci přístupu k databázi:

1. **Unifikovaný přístup k databázi** - Všechny skripty nyní používají `@neondatabase/serverless` klienta
2. **Oprava problémů s chybějícími tabulkami** - Vytvoření tabulky `users_sync`
3. **Sjednocení názvů sloupců** - Změna z `published` na `is_published`
4. **Modernizace skriptů** - Převod na ES Modules a .mjs formát
5. **Centralizovaný přístup k databázi** - Aktualizace `lib/database.ts`

## Jak používat databázové skripty

V projektu jsou k dispozici následující skripty pro práci s databází:

```bash
# Test připojení k databázi a zobrazení základních informací
npm run db:test

# Vytvoření základního schématu databáze
npm run db:schema

# Vytvoření tabulky users_sync (pokud neexistuje)
npm run db:users-sync

# Sjednocení názvů sloupců published/is_published
npm run db:unify

# Vytvoření základních tabulek (articles, categories)
npm run db:setup

# Spuštění všech výše uvedených skriptů v optimálním pořadí
npm run db:setup-all
```

## Struktura souborů

- `lib/database.ts` - Centrální přístupový bod k databázi
- `scripts/setup-schema.mjs` - Vytváří základní schéma databáze
- `scripts/test-db.mjs` - Testuje připojení k databázi
- `scripts/create-users-sync-table.mjs` - Vytvoří tabulku users_sync
- `scripts/unify-published-column-names.mjs` - Sjednocuje názvy sloupců
- `scripts/setup-database.mjs` - Vytváří základní tabulky
- `dokumentace/DATABASE_STANDARDIZATION.md` - Detailní dokumentace změn

## Jak pokračovat s vývojem

1. Pro přístup k databázi používejte `import { db, sql } from 'lib/database'`
2. Pro raw SQL dotazy používejte `sql` tagged template (např. `sql\`SELECT * FROM users\``)
3. Pro ORM přístup používejte `db` (Drizzle ORM klient)
4. Při vývoji nových skriptů pro správu databáze používejte ES Modules (.mjs soubory)

## Další informace

Pro podrobnější informace o standardizaci databáze, příklady použití a best practices viz [DATABASE_STANDARDIZATION.md](./dokumentace/DATABASE_STANDARDIZATION.md).
