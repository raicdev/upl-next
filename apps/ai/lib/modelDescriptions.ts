import { ThinkingEffort } from "@/hooks/use-chat-sessions";

export interface modelDescriptionType {
  [key: string]: ImodelDescriptionType;
}
export interface ImodelDescriptionType {
  canary?: boolean;
  description: string;
  displayName: string;
  offline?: boolean;
  toolDisabled?: boolean;
  vision?: boolean;
  fast?: boolean;
  defaultVisibility?: boolean;
  thinkingEfforts?: ThinkingEffort[];
  reasoning?: boolean;
  type: modelType;
}

export type modelType = "ChatGPT" | "Gemini" | "Claude" | "Grok" | "DeepSeek";

export const modelDescriptions: modelDescriptionType = {
  "gpt-4o-2024-08-06": {
    displayName: "GPT-4o",
    description: "OpenAI の推論機能がないフラッグシップモデル",
    defaultVisibility: true,
    canary: true,
    vision: true,
    type: "ChatGPT",
  },
  "gpt-4o-2024-11-20": {
    displayName: "GPT-4o (New)",
    description: "OpenAI の推論機能がないフラッグシップモデル",
    defaultVisibility: true,
    canary: true,
    vision: true,
    type: "ChatGPT",
  },
  "gpt-4o-mini-2024-07-18": {
    displayName: "GPT-4o mini",
    description: "GPT-4o にそっくりで、より高速なモデル",
    defaultVisibility: true,
    vision: true,
    canary: true,
    fast: true,
    type: "ChatGPT",
  },
  "o3-mini": {
    displayName: "o3-mini",
    description: "OpenAI の推論対応、高速、賢いモデル",
    reasoning: true,
    offline: true,
    thinkingEfforts: ["medium", "high"],
    type: "ChatGPT",
  },
  o1: {
    displayName: "o1",
    description: "OpenAI の推論機能があるフラッグシップモデル",
    canary: true,
    offline: true,
    reasoning: true,
    vision: true,
    type: "ChatGPT",
  },
  "o1-mini-2024-09-12": {
    displayName: "o1-mini",
    description: "o1 にそっくりで、より高速なモデル",
    reasoning: true,
    canary: true,
    fast: true,
    type: "ChatGPT",
  },
  "gemini-2.0-flash-exp": {
    displayName: "Gemini 2.0 Flash",
    description: "Google の最も早く正確なモデル",
    defaultVisibility: true,
    fast: true,
    vision: true,
    canary: true,
    type: "Gemini",
  },
  "gemini-2.0-flash-thinking-exp": {
    displayName: "Gemini 2.0 Flash (Thinking Exp)",
    description: "Google の推論対応のモデル",
    reasoning: true,
    fast: true,
    type: "Gemini",
  },
  "gemini-2.0-pro-exp": {
    displayName: "Gemini 2.0 Pro (Exp)",
    description: "Google のフラッグシップモデル",
    fast: true,
    type: "Gemini",
  },
  "gemini-1.5-pro": {
    displayName: "Gemini 1.5 Pro",
    description: "Google のフラッグシップモデル",
    canary: true,
    vision: true,
    fast: true,
    type: "Gemini",
  },
  "anthropic.claude-3-5-sonnet-20241022-v2:0": {
    displayName: "Claude 3.5 Sonnet",
    description: "Anthropic による複雑な問題のためのモデル",
    defaultVisibility: true,
    canary: true,
    vision: true,
    type: "Claude",
  },
  "DeepSeek-R1": {
    displayName: "DeepSeek R1",
    description: "DeepSeek によるオープンソースの早くて賢いモデル",
    defaultVisibility: true,
    toolDisabled: true,
    reasoning: true,
    canary: true,
    type: "DeepSeek",
  },
  "deepseek-r1-distill-llama-70b": {
    displayName: "DeepSeek R1 Distill",
    description: "DeepSeek R1 の軽量版モデル",
    reasoning: true,
    canary: true,
    type: "DeepSeek",
  },
  "deepseek-v3": {
    displayName: "DeepSeek V3",
    description: "推論機能のない DeepSeek R1 モデル",
    type: "DeepSeek",
  },
  "grok-3": {
    displayName: "Grok 3",
    description: "x.ai による Grok 3 モデル",
    defaultVisibility: true,
    type: "Grok",
  },
  "grok-3-r1": {
    displayName: "Grok 3 (Think)",
    description: "推論機能を搭載した Grok 3 モデル",
    defaultVisibility: true,
    reasoning: true,
    type: "Grok",
  },
};
