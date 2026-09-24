# Endast lokal lagring

## Ändringar
- Ta bort cookieinformationen och all kod som skriver cookies.
- Spara även eventuella gränssnittsinställningar i webbläsarens localStorage.
- Ta bort MCP- och molnkopplingarna så att appen inte skickar elevdata externt.
- Ta bort externa typsnittsanrop och använda lokala systemtypsnitt.
- Kontrollera att appens funktioner fortsatt fungerar och att inga spårnings- eller cookieanrop finns kvar.

## Tekniskt
- Behåll befintlig nyckel för localStorage så att sparad användardata inte går förlorad.
- Rensa oanvända paket och serverfiler kopplade till externa anslutningar.
