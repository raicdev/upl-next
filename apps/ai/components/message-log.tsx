import { FC, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, ChevronsUpDown, Copy, RefreshCw } from "lucide-react";
import { Button } from "@shadcn/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shadcn/collapsible";
import { CustomTooltip } from "./tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { Pre } from "@/components/markdown";

interface MessageLogProps {
  log: string;
  index: number;
  onRefresh: (index: number) => void;
  modelDescription: string;
}

export const MessageLog: FC<MessageLogProps> = memo(
  ({ log, index, onRefresh, modelDescription }) => {
    const handleCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
      navigator.clipboard.writeText(log.replace("AI: ", ""));
      const target = event.currentTarget;
      target.querySelector("svg")!.outerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(() => {
        target.querySelector("svg")!.outerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
      }, 1000);
    };

    const handleRefresh = (e: React.MouseEvent) => {
      e.preventDefault();
      onRefresh(index);
    };

    return (
      <div className={`flex w-full message-log visible`}>
        <div
          className={`p-2 my-2 rounded-lg ${
            log.startsWith("AI:") ? "text-white w-full" : "bg-secondary ml-auto"
          }`}
        >
          {log.startsWith("AI:") ? (
            <div>
              <div className="flex items-start w-full">
                <div className="p-1 bg-secondary flex-shrink-0">
                  <Bot />
                </div>
                {log.includes("<think>") ? (
                  <div className="ml-3 w-full max-w-11/12">
                    {log
                      .replace("AI: ", "")
                      .split(/<think>|<\/think>/)
                      .map((part, i) =>
                        i % 2 === 0 ? (
                          <ReactMarkdown
                            key={i}
                            className="prose dark:prose-invert"
                          >
                            {part}
                          </ReactMarkdown>
                        ) : (
                          <Collapsible key={i} className="p-2 space-y-2">
                            <CollapsibleTrigger asChild>
                              <Button variant={"outline"} className="w-full md:w-2/3 lg:w-1/2">
                                <h4 className="text-sm font-semibold">
                                  思考過程を見る
                                </h4>
                                <ChevronsUpDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent
                              className={cn(
                                "text-popover-foreground border-l-2 pl-3 border-foreground outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                              )}
                            >
                              <ReactMarkdown
                                className="prose dark:prose-invert mt-2"
                              >
                                {part}
                              </ReactMarkdown>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      )}
                  </div>
                ) : (
                  <ReactMarkdown
                  components={{pre: Pre}}
                    className="ml-3 prose dark:prose-invert w-full max-w-11/12"
                  >
                    {log.replace("AI: ", "")}
                  </ReactMarkdown>
                )}
              </div>{" "}
              <div className="flex items-center rounded mt-3 bg-secondary text-xs">
                <div className="p-1 text-gray-400 hover:text-foreground">
                  <CustomTooltip content="コピー">
                    <Button
                      size="icon"
                      className="p-0"
                      onClick={handleCopy}
                      variant="ghost"
                    >
                      <Copy size="16" />
                    </Button>
                  </CustomTooltip>
                </div>
                <div className="p-1 text-gray-400 hover:text-foreground">
                  <CustomTooltip
                    content={`再生成 (${modelDescription} を使用)`}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleRefresh}
                    >
                      <RefreshCw size="16" />
                    </Button>
                  </CustomTooltip>
                </div>
              </div>
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="p-1">
              {log}
            </ReactMarkdown>
          )}
        </div>
      </div>
    );
  }
);

MessageLog.displayName = "MessageLog";