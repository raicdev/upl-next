import { FC, memo, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { EasyTip } from "@repo/ui/components/easytip";
import { Pre } from "@/components/markdown";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { ModelSelector } from "./ModelSelector";
import Image from "next/image";
import { UIMessage } from "ai";
import React from "react";
import { ThinkingEffort, useChatSessions } from "@/hooks/use-chat-sessions";
import { marked } from "marked";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
interface MessageLogProps {
  message: UIMessage;
  sessionId: string;
  // visionRequired: boolean;
  // onRefresh: (index: number, model: string) => void;
}

export const MemoMarkdown = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: Pre }}>
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);
MemoMarkdown.displayName = "MemoMarkdown";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return blocks.map((block, index) => (
      <MemoMarkdown content={block} key={`${id}-block_${index}`} />
    ));
  }
);
MemoizedMarkdown.displayName = "MemoizedMarkdown";

export const MessageLog: FC<MessageLogProps> = memo(
  ({ message, sessionId /*, onRefresh, visionRequired */ }) => {
    const [thinkingEffort, setThinkingEffort] =
      React.useState<ThinkingEffort>("medium");
    const [model, setModel] = React.useState<string>("gpt-4o-2024-08-06");
    const [thinkingTime, setThinkingTime] = React.useState<number>(0);

    const { getSession, updateSession } = useChatSessions();

    const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
      navigator.clipboard.writeText(message.content);
      const target = event.currentTarget;
      target.querySelector("svg")!.outerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(() => {
        target.querySelector("svg")!.outerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      }, 1000);
    };

    useEffect(() => {
      const annotations = message.annotations;
      if (annotations) {
        const annotation = annotations[0] as {
          title?: string;
          model?: string;
          thinkingEffort?: ThinkingEffort;
        };
        if (annotation) {
          if (annotation.title) {
            const session = getSession(sessionId);
            if (session) {
              session.title = annotation.title;
              updateSession(sessionId, session);
            }

            const annotation2 = annotations[1] as {
              model?: string;
              thinkingEffort?: ThinkingEffort;
            };

            if (!annotation2) {
              return;
            }

            setModel(
              (annotation2.model || "gpt-4o-2024-08-06").replace("-high", "")
            );
            setThinkingEffort(annotation2.thinkingEffort || "medium");

            const annotation3 = annotations[2] as {
              thinkingTime: number;
            };
            if (annotation3) {
              setThinkingTime(annotation3.thinkingTime);
            }
          } else {
            setModel(
              (annotation.model || "gpt-4o-2024-08-06").replace("-high", "")
            );
            setThinkingEffort(annotation.thinkingEffort || "medium");

            const annotation2 = annotations[1] as {
              thinkingTime: number;
            };
            if (annotation2) {
              setThinkingTime(annotation2.thinkingTime);
            }
          }
        }
      }
    }, [message.annotations]);

    return (
      <div className={`flex w-full message-log visible`}>
        <div
          className={`p-2 my-2 rounded-lg ${
            message.role == "assistant"
              ? "text-white w-full"
              : "bg-secondary ml-auto p-3"
          }`}
        >
          {message.role == "assistant" ? (
            <div>
              {thinkingTime > 0 && (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <p className="ml-3 cursor-default text-muted-foreground">
                      {thinkingTime >= 60000
                        ? `${Math.floor(thinkingTime / 60000)} 分の間、`
                        : thinkingTime >= 3600000
                          ? `${Math.floor(thinkingTime / 3600000)} 時間の間、`
                          : `${Math.round(thinkingTime / 1000 || 1)} 秒の間、`}
                      {modelDescriptions[model]?.reasoning ? "推論" : "考え"}
                      済み
                    </p>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="prose dark:prose-invert">
                    <MemoizedMarkdown
                      id={sessionId + "_reasoning"}
                      content={
                        message.content.match(/<think>(.*?)<\/think>/s)?.[1] ||
                        ""
                      }
                    ></MemoizedMarkdown>
                  </CollapsibleContent>
                </Collapsible>
              )}{" "}
              <div className="ml-3 prose dark:prose-invert w-full max-w-11/12">
                <MemoizedMarkdown
                  id={sessionId + "_assistant"}
                  content={
                    message.content.startsWith("<think>") &&
                    !message.content.includes("</think>")
                      ? ""
                      : message.content.replace(/<think>(.*?)<\/think>/s, "")
                  }
                />
              </div>{" "}
              <div className="flex items-center rounded mt-3 bg-secondary text-xs">
                <div className="p-1 text-gray-400 hover:text-foreground">
                  <EasyTip content="コピー">
                    <Button
                      size="sm"
                      className="p-0 ml-2 rounded-full"
                      variant={"ghost"}
                      onClick={handleCopy}
                    >
                      <Copy size="16" />
                    </Button>
                  </EasyTip>
                </div>
                <div className="p-1 text-gray-400 hover:text-foreground">
                  <EasyTip content={`再生成`}>
                    <ModelSelector
                      modelDescriptions={modelDescriptions}
                      model={model || "gpt-4o-2024-08-06"}
                      thinkingEffort={
                        modelDescriptions[model]?.thinkingEfforts &&
                        thinkingEffort
                      }
                      // visionRequired={visionRequired}
                      refreshIcon={true}
                      handleModelChange={(model: string) => {
                        // onRefresh(index, model);
                      }}
                    />
                  </EasyTip>
                </div>
              </div>
            </div>
          ) : (
            <>
              {message.experimental_attachments && (
                <Image
                  alt="画像"
                  src={message.experimental_attachments[0]?.url || ""}
                  width="300"
                  height="300"
                ></Image>
              )}
              <div className="prose dark:prose-invert">{message.content}</div>
            </>
          )}
        </div>
      </div>
    );
  }
);
MessageLog.displayName = "MessageLog";
