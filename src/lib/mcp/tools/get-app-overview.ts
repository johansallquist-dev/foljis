import { defineTool } from "@lovable.dev/mcp-js";
import { defaultRoutine, defaultEveningRoutine } from "../../types";

const SPECIES = [
  { id: "sun", label: "Sol" },
  { id: "fox", label: "Räv" },
  { id: "panda", label: "Panda" },
  { id: "bunny", label: "Kanin" },
  { id: "cat", label: "Katt" },
  { id: "dog", label: "Labrador" },
  { id: "horse", label: "Häst" },
  { id: "penguin", label: "Pingvin" },
  { id: "giraffe", label: "Giraff" },
];

export default defineTool({
  name: "get_app_overview",
  title: "Om appen",
  description:
    "Förklarar vad Följis-appen är, vilka funktioner den har, hur Följispoäng fungerar, vilka följis-arter som finns och vilka standardrutiner som föreslås för morgon och kväll.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const overview = {
      name: "Följis",
      language: "sv",
      description:
        "En app som hjälper barn och unga att komma igång på morgonen, landa på kvällen, hålla koll på sitt schema och checka in sitt mående – med en egen följis (digital kompis) som följer med.",
      features: [
        "Morgonchecklista med egna punkter som kan flyttas i ordning",
        "Kvällschecklista med förberedelser inför nästa dag",
        "Schema med aktiviteter (lektioner, fotboll, musik m.m.) som kan betygsättas rött/gult/grönt med kommentar",
        "Måendecheck-in med känslor och anteckning – krävs innan morgon- och kvällsrutin",
        "Tips och råd anpassade för skoldagen",
        "Achievements och Följispoäng",
        "Affär där Följispoäng byts mot tillbehör och bakgrunder till följisen",
        "Sammanställning (PDF) som eleven själv kan dela med vårdnadshavare eller mentor",
      ],
      points: {
        name: "Följispoäng",
        earning: [
          "+5 per avbockad rutinpunkt (morgon och kväll), +15 bonus när hela rutinen är klar",
          "+10 för en måendecheck-in",
          "+3 för en genomförd aktivitet, +1–2 extra för betyget",
          "+2 för ett läst tips",
          "+1 var femte klapp på följisen",
        ],
        spending: "Följispoäng används i affären för tillbehör och bakgrunder.",
      },
      companionSpecies: SPECIES,
      defaultMorningRoutine: defaultRoutine.map((r) => r.label),
      defaultEveningRoutine: defaultEveningRoutine.map((r) => r.label),
      dataStorage:
        "All elevdata lagras lokalt i elevens webbläsare (localStorage). Ingen personlig data finns tillgänglig via det här MCP-gränssnittet.",
    };

    return {
      content: [{ type: "text" as const, text: JSON.stringify(overview, null, 2) }],
      structuredContent: overview,
    };
  },
});
