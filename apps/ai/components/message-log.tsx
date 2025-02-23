import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { EasyTip } from "@repo/ui/components/easytip";
import { Pre } from "@/components/markdown";
import { ChatMessage } from "@/hooks/use-chat-sessions";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { ModelSelector } from "./input-area";
import Image from "next/image";

interface MessageLogProps {
  log: ChatMessage;
  index: number;
  visionRequired: boolean;
  onRefresh: (index: number, model: string) => void;
}

export const MessageLog: FC<MessageLogProps> = memo(
  ({ log, index, onRefresh, visionRequired }) => {
    const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
      navigator.clipboard.writeText(log.message);
      const target = event.currentTarget;
      target.querySelector("svg")!.outerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(() => {
        target.querySelector("svg")!.outerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      }, 1000);
    };

    return (
      <div className={`flex w-full message-log visible`}>
        <div
          className={`p-2 my-2 rounded-lg ${
            log.author === "ai" ? "text-white w-full" : "bg-secondary ml-auto"
          }`}
        >
          {log.author === "ai" ? (
            <div>
              <div>
                {log.thinkingTime && (
                  <p className="ml-3 text-muted-foreground">
                    {log.thinkingTime >= 60
                      ? `${Math.floor(log.thinkingTime / 60)} 分の間、`
                      : log.thinkingTime >= 3600
                        ? `${Math.floor(log.thinkingTime / 3600)} 時間の間、`
                        : `${Math.round(log.thinkingTime || 1)} 秒の間、`}
                    {modelDescriptions[log.model || "gpt-4o-free"]?.reasoning
                      ? "推論"
                      : "考え"}
                    済み
                  </p>
                )}
                <ReactMarkdown
                  components={{ pre: Pre }}
                  className="ml-3 prose dark:prose-invert w-full max-w-11/12"
                >
                  {log.message}
                </ReactMarkdown>
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
                      model={log.model || "o3-mini"}
                      visionRequired={visionRequired}
                      thinkEffort={log.thinkingEffort}
                      refreshIcon={true}
                      handleModelChange={(model: string) => {
                        onRefresh(index, model);
                      }}
                    />
                  </EasyTip>
                </div>
              </div>
            </div>
          ) : (
            <>
            {(log.image && (
              <Image alt="画像" src={log.image} width="300" height="300"></Image>
            ))}
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="p-1">
                {log.message}
              </ReactMarkdown>
            </>
          )}
        </div>
      </div>
    );
  }
);
MessageLog.displayName = "MessageLog";
