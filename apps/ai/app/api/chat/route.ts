import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText, tool } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
  baseURL: 'https://api.voids.top/v1', // custom base URL
  apiKey: "no", // API key
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const response = streamText({
      model: openai(json.model),
      messages: json.messages,
    })
    
  // Removed tool calls logging that was blocking response
    return response.toTextStreamResponse();
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json({ error: "Internal Server Error" });
  }
}
