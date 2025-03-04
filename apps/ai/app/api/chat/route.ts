import { modelDescriptions } from "@/lib/modelDescriptions";
import { systemPromptBase } from "@/lib/systemPrompt";
import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToCoreMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
  tool,
  UIMessage,
} from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");
    const { messages, model }: { messages: UIMessage[]; model: string } =
      await req.json();

    if (!model || messages.length === 0) {
      return Response.json({ error: "Invalid request" });
    }

    console.log(model);

    const modelDescription = modelDescriptions[model.replace("-high", "")];
    const isCanary = modelDescription?.canary;
    const highEffort = model.includes("-high");
    const openai = createOpenAI({
      // custom settings, e.g.
      compatibility: "strict", // strict mode, enable when using the OpenAI API
      baseURL: isCanary
        ? "https://capi.voids.top/v1"
        : "https://api.voids.top/v1", // custom base URL
      apiKey: "no", // API key
    });

    // some checks
    if (isCanary && !authorization) {
      return NextResponse.json({
        state: "error",
        error: "Authorization Required",
      });
    }

    if (modelDescription?.offline) {
      return NextResponse.json({
        state: "error",
        error: "This model is currently not available.",
      });
    }

    const coreMessage = convertToCoreMessages(messages);

    coreMessage.unshift({
      role: "system",
      content: systemPromptBase,
    });

    const startTime = Date.now();
    let firstChunk = false;

    return createDataStreamResponse({
      execute: (dataStream) => {
        const response = streamText({
          model: openai(model),
          messages: coreMessage,
          tools: modelDescription?.toolDisabled
            ? undefined
            : {
                setTitle: tool({
                  description:
                    "Set title for this conversation. (FIRST ONLY, REQUIRED)",
                  parameters: z.object({
                    title: z.string().describe("Title for this conversation."),
                  }),
                  execute: async ({ title }) => {
                    dataStream.writeMessageAnnotation({
                      title,
                    });

                    return "OK";
                  },
                }),
              },
          toolChoice: "auto",
          maxSteps: 3,
          maxTokens: 2048,
          onChunk() {
            if (!firstChunk) {
              firstChunk = true;
              dataStream.writeMessageAnnotation({
                model,
                thinkingEffort: highEffort ? "high" : "medium",
              });
            }
          },
          onFinish() {
            const thinkingTime = Date.now() - startTime;
            dataStream.writeMessageAnnotation({
              thinkingTime,
            });
          },
          onError(error) {
            console.error(error);
          },
        });

        response.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error });
  }
}
