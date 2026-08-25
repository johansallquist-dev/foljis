import { defineTool } from "@lovable.dev/mcp-js";
import { ACHIEVEMENTS } from "@/lib/achievements";

export default defineTool({
  name: "list_achievements",
  title: "Lista achievements",
  description:
    "Lista alla achievements som går att låsa upp i Följis-appen, med titel, beskrivning och tips om hur man låser upp dem.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const achievements = ACHIEVEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      hint: a.hint,
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: achievements.map((a) => `${a.title} – ${a.description} (${a.hint})`).join("\n"),
        },
      ],
      structuredContent: { count: achievements.length, achievements },
    };
  },
});
