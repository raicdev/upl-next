export interface modelDescriptionType {
  [key: string]: {
    description: string;
    displayName?: string;
    offline?: boolean;
    reasoning?: boolean;
    beta?: boolean;
    outdated?: boolean;
    type: modelType;
  };
}

export type modelType = "ChatGPT" | "Gemini" | "Claude" | "Grok" | "DeepSeek"

export const modelDescriptions: modelDescriptionType = {
  "gpt-4o-2024-08-06": {
    description: "日常の作業を効率化",
    displayName: "GPT-4o",
    type: "ChatGPT",
  },
  "gpt-4o-mini": {
    description: "日常の作業を効率化",
    displayName: "GPT-4o mini",
    type: "ChatGPT",
  },
  "deepseek-r1": {
    description: "o1と同じ性能の低価格なモデル",
    displayName: "DeepSeek R1",
    reasoning: true,
    type: "DeepSeek",
  },
  "claude-3-5-sonnet-20241022": {
    description: "最も賢いAIモデル",
    displayName: "Claude 3.5 Sonnet",
    type: "Claude",
  },
  "grok-2": {
    description: "ユーモア溢れるAIアシスタント",
    displayName: "Grok 2",
    type: "Grok",
  },
  "o1-preview": {
    description: "高度な推論を使用する",
    displayName: "o1-preview",
    beta: true,
    reasoning: true,
    type: "ChatGPT",
  },
  "o1-mini": {
    description: "推論がスピードアップ",
    displayName: "o1-mini",
    beta: true,
    reasoning: true,
    type: "ChatGPT",
  },
  "gemini-1.5-pro-exp-0827": {
    description: "幅広いタスク対応の最高モデル",
    displayName: "Gemini 1.5 Pro",
    beta: true,
    type: "Gemini",
  },
  "gemini-1.5-flash-exp-0827": {
    description: "スピードと効率を最適化",
    displayName: "Gemini 1.5 Flash",
    beta: true,
    type: "Gemini",
  },
};
