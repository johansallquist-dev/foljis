import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SHOP_ITEMS, SHOP_CATEGORIES } from "../../shop";

export default defineTool({
  name: "list_shop_items",
  title: "Lista affärens sortiment",
  description:
    "Lista allt som går att köpa med Följispoäng i appens affär: tillbehör/kläder och bakgrunder, med pris.",
  inputSchema: {
    category: z
      .enum(["accessory", "background"])
      .optional()
      .describe("Begränsa till tillbehör eller bakgrunder."),
    maxPrice: z.number().optional().describe("Visa bara saker som kostar högst så många Följispoäng."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, maxPrice }) => {
    const labels = Object.fromEntries(SHOP_CATEGORIES.map((c) => [c.id, c.label]));
    const items = SHOP_ITEMS.filter(
      (i) => (!category || i.category === category) && (maxPrice == null || i.price <= maxPrice),
    ).map((i) => ({
      id: i.id,
      category: i.category,
      categoryLabel: labels[i.category] ?? i.category,
      name: i.name,
      description: i.description,
      price: i.price,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: items.length
            ? items.map((i) => `${i.name} (${i.categoryLabel}) – ${i.price} Följispoäng: ${i.description}`).join("\n")
            : "Inget i affären matchade filtret.",
        },
      ],
      structuredContent: { count: items.length, items },
    };
  },
});
