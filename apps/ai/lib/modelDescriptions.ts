import { ThinkingEffort } from "@/hooks/use-chat-sessions";

export interface modelDescriptionType {
  [key: string]: {
    canary?: boolean; // capi or api (.voids.top)
    description?: string;
    displayName?: string;
    offline?: boolean;
    vision?: boolean;
    thinkEfforts?: ThinkingEffort[];
    reasoning?: boolean;
    type: modelType;
  };
}

export type modelType = "ChatGPT" | "Gemini" | "Claude" | "Grok" | "DeepSeek"

export const modelDescriptions: modelDescriptionType = {
  "gpt-4o-free": {
    displayName: "GPT-4o",
    description: "OpenAI の推論機能がないフラッグシップモデル。",
    type: "ChatGPT",
  },
  "gpt-4o-mini-free": {
    displayName: "GPT-4o mini",
    description: "GPT-4o にそっくりで、より高速。",
    type: "ChatGPT",
  },
  "o3-mini": {
    displayName: "o3-mini",
    description: "OpenAI の推論対応、高速、賢いモデル。",
    canary: true,
    reasoning: true,
    thinkEfforts: ["medium", "high"],
    type: "ChatGPT",
  },
  "o1": {
    displayName: "o1",
    description: "OpenAI の推論機能があるフラッグシップモデル。",
    canary: true,
    offline: true,
    reasoning: true,
    vision: true,
    type: "ChatGPT",
  },
  "gemini-2.0-flash-001": {
    displayName: "Gemini 2.0 Flash",
    description: "Google の最も高速で正確なモデル",
    canary: true,
    reasoning: true,
    type: "Gemini",
  },
  "gemini-pro-1.5": {
    displayName: "Gemini 1.5 Pro",
    description: "Google のフラッグシップモデル。",
    type: "Gemini",
  },
  "claude-3-5-sonnet-20241022": {
    displayName: "Claude 3.5 Sonnet",
    description: "Anthropic による複雑な問題のためのモデル。",
    type: "Claude",
  },
  "deepseek-r1": {
    displayName: "DeepSeek R1",
    description: "DeepSeek によるオープンソースの早くて賢いモデル",
    reasoning: true,
    type: "DeepSeek",
  },
  "grok-2": {
    displayName: "Grok 2",
    description: "x.ai による Grok 2 モデル。",
    type: "Grok",
  }
};
