# Närvaroapp för grundskoleelever

En lugn, vänlig app som hjälper elever att komma iväg till skolan och klara dagen. Allt sparas lokalt på enheten – ingen inloggning, inga andra användare, helt privat.

## Designkänsla

- Mjuka, varma färger (pastell – lugn blå/grön som primär, varm gul som accent)
- Stora knappar, rundade hörn, läsvänlig typografi
- Vänligt och uppmuntrande språk anpassat för barn (ca 7–15 år)
- Mobilformat i fokus, men fungerar även på surfplatta/dator

## Skärmar & flöde

### 1. Hem (dagens vy)

- Positiv Hälsning + dagens datum
- **Följeslagaren** stor i mitten – ett djur/varelse som ser glad/pigg ut beroende på poäng & streak
- Streak-räknare ("🔥 5 dagar i rad")
- Poäng-räknare
- Snabbknappar: Morgonrutin · Mående · Schema · Tips
- Visar nästa lektion enligt schemat

### 2. Morgonrutin

- Anpassningsbar checklista (eleven kan lägga till/ta bort/byta ordning på punkter som "Ätit frukost", "Borstat tänderna", "Packat väskan", "Tagit på kläder")
- Varje avbockad punkt ger poäng och en liten animation
- När hela listan är klar: följeslagaren firar + bonuspoäng

### 3. Mitt schema

- Eleven lägger in sina lektioner per veckodag (ämne, tid, sal, valfri ikon/färg)
- Visar dagens schema som en tidslinje
- Möjlighet att markera lektion som "klar" för poäng

### 4. Mående-incheckning

- **Steg 1:** Emoji-skala (1–5) – "Hur mår du just nu?"
- **Steg 2:** Känslohjul – välj specifik känsla (glad, lugn, orolig, ledsen, arg, trött, stressad, osv.)
- **Steg 3:** Coping-tips anpassade efter känslan (t.ex. andningsövning vid oro, rörelsepaus vid trötthet, prata-med-någon-tips vid ledsen)
- Möjlighet att checka in flera gånger per dag (morgon/lunch/eftermiddag)
- Mående-historik som eleven själv kan titta på (enkelt diagram över veckan)

### 5. Tips & hjälp

- Bibliotek med korta tips i kategorier:
  - "Klara morgonen"
  - "Om det känns jobbigt i skolan"
  - "Andningsövningar"
  - "Sociala situationer"
  - "Koncentration & läxor"
- Korta, lättlästa kort med en illustration och 2–3 meningar

### 6. Min följeslagare & achievements

- Stor vy av följeslagaren med dess "humör" och nivå
- Lista med upplåsta achievements ("Första veckan!", "10 dagar i streak", "Checkat in måendet 20 gånger", "5 morgnar i rad med full checklista", osv.)
- Låsta achievements visas otydligt med ledtråd

## Gamification-system

- **Poäng** ges för: morgonrutin-punkter, mående-incheckning, markera lektion klar, läsa ett tips
- **Streak** räknas per dag där eleven har gjort minst en aktivitet (mående-incheckning räcker)
- **Följeslagaren** har stadier: trött → ok → glad → strålande, baserat på senaste dagarnas aktivitet och streak. Animeras lätt.
- **Achievements** låses upp automatiskt vid milstolpar
- Ingen jämförelse med andra någonsin – inga ledartavlor, inga andra användare syns

## Integritet

- Allt sparas i webbläsarens lokala lagring på enheten
- Inga konton, ingen server, ingen delning
- Inställning för att rensa all data om eleven vill börja om

## Teknisk översikt

- React + TypeScript + Tailwind + shadcn/ui (befintlig stack)
- React Router för navigation mellan vyer
- LocalStorage för all data (schema, rutin, mående-historik, poäng, streak, achievements)
- Lottie eller CSS-animationer för följeslagaren och firande
- date-fns för datum/streak-logik
- Recharts för enkelt mående-diagram
- Designsystem uppdateras i `index.css` och `tailwind.config.ts` med mjuka semantiska färgtokens

## Vad vi bygger i denna första version

1. Designsystem (färger, typografi, ton)
2. Hem-skärm med följeslagare, streak och poäng
3. Anpassningsbar morgonrutin
4. Schema (lägga till/redigera lektioner per veckodag)
5. Mående-incheckning med emoji + känslohjul + coping-tips
6. Tipsbibliotek (med ett startinnehåll på ~15–20 tips)
7. Achievements-vy och poäng/streak-logik
8. LocalStorage-persistens + "rensa data"-inställning

Vill du köra igång detta som det är, eller ändra något först?