import { modelDescriptions } from "@/lib/modelDescriptions";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const json = await req.json();

    if (!json.model || json.messages.length === 0) {
      return Response.json({ error: "Invalid request" });
    }

    const isCanary = modelDescriptions[json.model]?.canary;
    const openai = createOpenAI({
      // custom settings, e.g.
      compatibility: "strict", // strict mode, enable when using the OpenAI API
      baseURL: isCanary
        ? "https://capi.voids.top/v1"
        : "https://api.voids.top/v1", // custom base URL
      apiKey: "no", // API key
    });


    const response = streamText({
      model: openai(json.model),
      messages: json.messages
    });

    // Removed tool calls logging that was blocking response
    return response.toTextStreamResponse();
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
