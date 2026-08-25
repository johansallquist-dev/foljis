import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { COPING_BY_FEELING, FEELINGS } from "../../tips";
import type { Feeling } from "../../types";

const feelings = FEELINGS.map((f) => f.value) as [Feeling, ...Feeling[]];

export default defineTool({
  name: "suggest_coping",
  title: "Förslag utifrån känsla",
  description:
    "Ge appens konkreta förslag på vad man kan göra när man känner en viss känsla (t.ex. stressad, ledsen, okoncentrerad).",
  inputSchema: {
    feeling: z.enum(feelings).describe("Känslan som förslagen ska matcha."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ feeling }) => {
    const suggestions = COPING_BY_FEELING[feeling] ?? [];
    return {
      content: [
        {
          type: "text" as const,
          text: suggestions.length
            ? `När man känner sig ${feeling}:\n- ${suggestions.join("\n- ")}`
            : `Inga förslag finns för känslan ${feeling}.`,
        },
      ],
      structuredContent: { feeling, suggestions },
    };
  },
});
