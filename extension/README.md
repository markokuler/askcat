# AskCat Chrome Extension

Chrome extension za analizu bilo koje web stranice i pronalaženje relevantnih kapaciteta za sales outreach.

## Funkcionalnosti

- **Analiziraj stranicu** - Izvlači ključne informacije sa trenutne stranice (LinkedIn profil, company page, job posting, etc.)
- **Pronađi kapacitete** - Pretražuje bazu zaposlenih, projekata i repozitorijuma
- **Generiši outreach** - Kreira personalizovan email na osnovu stranice i pronađenih kapaciteta

## Instalacija

### 1. Generiši ikone

Potrebne su PNG ikone u `icons/` folderu:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

Možeš koristiti bilo koji logo ili kreirati jednostavan icon.

### 2. Učitaj extension u Chrome

1. Otvori `chrome://extensions/`
2. Uključi "Developer mode" (gore desno)
3. Klikni "Load unpacked"
4. Izaberi `extension/` folder

### 3. Koristi extension

1. Idi na bilo koju stranicu (LinkedIn, company website, etc.)
2. Klikni na AskCat ikonu u toolbaru
3. Klikni "Analiziraj stranicu" ili "Generiši outreach email"

## Razvoj

### API Endpoint

Extension koristi `/api/analyze-page` endpoint:

```typescript
POST /api/analyze-page
{
  pageContent: string,     // Tekst sa stranice
  pageUrl: string,         // URL stranice
  pageTitle: string,       // Naslov stranice
  generateOutreach?: boolean // Da li generisati email
}
```

### Lokalni razvoj

1. Pokreni Next.js dev server: `npm run dev`
2. Promeni `API_BASE` u `popup.js` na `http://localhost:3000`
3. Reload extension u Chrome

## Struktura

```
extension/
├── manifest.json    # Extension config (Manifest V3)
├── popup.html       # Popup UI
├── popup.js         # Popup logic
├── content.js       # Content script (čita stranicu)
├── background.js    # Service worker
├── icons/           # Extension ikone
└── README.md        # Ova dokumentacija
```
