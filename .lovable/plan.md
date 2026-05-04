## Mål
Ersätt Cookiebot-skriptet med en egen, enkel cookiebanner som meddelar användaren att appen endast använder localStorage.

## Viktig teknisk notering
Du önskar att komponenten placeras i `<head>` så den körs före andra script. Detta är inte möjligt — React-komponenter (JSX) kan inte renderas i `<head>`, de kräver React-rendering i `<body>`. Däremot:
- Bannern behöver inte blockera andra script eftersom den inte gör någon extern spårning — det enda den gör är att skriva till `localStorage`.
- Komponenten renderas direkt när appen mountas, alltså omedelbart vid sidladdning.

Om du senare vill ha en banner som verkligen blockerar laddning innan användaren godkänner, behöver det skrivas som vanlig `<script>` i `index.html` (utan React).

## Ändringar

### 1. `index.html`
Ta bort denna rad (Cookiebot-skriptet som lades till tidigare):
```html
<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="..." data-blockingmode="auto" type="text/javascript"></script>
```

### 2. Ny fil: `src/components/CookieBanner.tsx`
Skapa komponenten enligt din specifikation, med små förbättringar för att passa projektets stil:
- Använd `useState` + `useEffect` för att läsa `localStorage` säkert (undvik direkt åtkomst i render).
- Använd projektets befintliga `Button`-komponent och Tailwind-klasser så bannern matchar resten av designen, istället för inline-styles.
- Behåll logiken: nyckel `cookieConsent`, värde `'true'`, dölj efter godkännande.

### 3. `src/App.tsx`
Rendera `<CookieBanner />` inuti `AppStateProvider` (bredvid `<AppContent />`) så den visas på alla sidor, inklusive onboarding.

## Resultat
- Inga externa cookie-/spårningsskript laddas.
- En diskret banner längst ner uppmanar till godkännande första besöket.
- Valet sparas i `localStorage` och bannern visas inte igen.
