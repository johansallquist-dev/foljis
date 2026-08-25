import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TIPS, TIP_CATEGORIES } from "@/lib/tips";

export default defineTool({
  name: "list_tips",
  title: "Lista tips och råd",
  description:
    "Lista Följis-appens tips och råd för barn (morgon, skola, andning, social, fokus, kväll, sömn, kropp). Filtrera på kategori eller sökord.",
  inputSchema: {
    category: z
      .enum(["morgon", "skola", "andning", "social", "fokus", "kvall", "sömn", "kropp"])
      .optional()
      .describe("Begränsa till en kategori."),
    query: z.string().optional().describe("Fritextsökning i titel och text."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, query }) => {
    const q = query?.toLowerCase();
    const tips = TIPS.filter(
      (t) =>
        (!category || t.category === category) &&
        (!q || t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)),
    ).map((t) => ({
      id: t.id,
      category: t.category,
      categoryLabel: TIP_CATEGORIES[t.category]?.label ?? t.category,
      title: t.title,
      body: t.body,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: tips.length
            ? tips.map((t) => `[${t.categoryLabel}] ${t.title}\n${t.body}`).join("\n\n")
            : "Inga tips matchade sökningen.",
        },
      ],
      structuredContent: { count: tips.length, tips },
    };
  },
});
