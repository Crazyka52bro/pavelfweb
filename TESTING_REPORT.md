# Testovací report aplikace Pavel Fišer CMS

## Datum testování
21. července 2025

## Testované oblasti

### Frontend
- Procházení hlavní stránky a všech sekcí (Hero, O mně, Priority, Projekty, Časová osa, Reference, Facebook příspěvky, Novinky, Kontaktní formulář, Newsletter)
- Kontrola zobrazení a funkčnosti UI komponent
- Ověření navigace v rámci stránky (odkazy v hlavičce)
- Testování interakce s formuláři (kontaktní formulář, přihlášení k newsletteru)

### Backend / API
- Testování základního připojení k databázi přes testovací endpoint `/api/test-db-connection` (vrácení aktuálního času z DB)
- Ověření autentizace a autorizace na chráněných API endpointů (např. `/api/admin/newsletter/campaigns` vrací 401 bez tokenu)
- Kontrola správné funkčnosti API endpointů pro newsletter (vytváření, získávání kampaní)
- Testování chybových stavů (neautorizovaný přístup, chybějící data)

## Zjištěné problémy
- Původní chyby v importech v API routech byly opraveny (přechod na absolutní aliasy)
- Problémy s připojením k databázi byly částečně vyřešeny, testovací endpoint funguje správně
- Některé API endpointy vyžadují autentizaci, bez ní vrací 401 Unauthorized

## Doporučení
- Doplnit autentizační tokeny pro testování chráněných API endpointů
- Pokračovat v testování všech API endpointů s validní autentizací
- Provést detailní testování uživatelských scénářů na frontendu

---

Tento report bude průběžně aktualizován s dalšími výsledky testování.
