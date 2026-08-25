import { defineMcp } from "@lovable.dev/mcp-js";
import getAppOverviewTool from "./tools/get-app-overview";
import listTipsTool from "./tools/list-tips";
import listAchievementsTool from "./tools/list-achievements";
import listShopItemsTool from "./tools/list-shop-items";
import suggestCopingTool from "./tools/suggest-coping";

export default defineMcp({
  name: "foljis-mcp",
  title: "Följis",
  version: "0.1.0",
  instructions:
    "Verktyg för Följis – en svensk app som hjälper barn med morgon- och kvällsrutiner, schema, mående och en digital kompis (följis). Använd get_app_overview för att förstå appen, list_tips för tips och råd, suggest_coping för förslag utifrån en känsla, list_achievements för achievements och list_shop_items för affärens sortiment. Verktygen ger bara allmänt appinnehåll – ingen elevdata, den lagras lokalt i elevens webbläsare.",
  tools: [getAppOverviewTool, listTipsTool, suggestCopingTool, listAchievementsTool, listShopItemsTool],
});
