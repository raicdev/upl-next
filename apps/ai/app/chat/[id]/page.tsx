"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@repo/ui/lib/utils";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@repo/ui/components/alert-dialog";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { Bot, Brain } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import Compare from "@/components/compare";
import { MessageLog } from "@/components/message-log";
import { ChatMessage, useChatSessions } from "@/hooks/use-chat-sessions";
import { useParams } from "next/navigation";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { ModelSelector } from "@/components/input-area";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { ChatSidebar } from "@/components/chat-sidebar";

const ChatApp: React.FC = () => {
  const [deniThink, setDeniThink] = useState(false);

  const { updateSession, getSession } = useChatSessions();

  const params = useParams<{ id: string }>();
  const currentSession = getSession(params.id);

  const router = useRouter();

  const [model, setModel] = useState("o3-mini");
  const [isOpen, setIsOpen] = useState(false);

  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      router.push("/home");
    }
  }, [currentSession, router]);

  // メッセージ送信のユーティリティ関数
  const sendChatMessage = async (messages: ChatMessage[]) => {
    let systemMessage = "";
    if (deniThink) {
      systemMessage += [
        "あなたは高度な論理的思考と理由付け能力を持つアシスタントです。以下の指示に従って、すべての質問に対して深く考察し、正確で論理的な回答を生成してください。",
        "",
        "1. **段階的な思考:**",
        "- 各回答は「ステップバイステップ」の形式で構成し、論理の展開や各ステップの根拠を明確に示してください。",
        "- 複数の可能性がある場合は、それぞれの選択肢の検討過程も含めて説明してください。",
        "",
        "2. **正確性と事実確認:**",
        "- 憶測や仮定に基づく回答は行わず、確実な情報に基づいて回答してください。",
        "- 分からない情報や不確かな部分がある場合は、正直に「わからない」と回答し、必要に応じて信頼できる情報源の参照も示してください。",
        "",
        "3. **ハルシネーションの回避:**",
        "- 架空の情報や誤った情報（ハルシネーション）の生成を厳に避け、事実に基づいた内容のみを提供してください。",
        "",
        "4. **完全かつ詳細な回答:**",
        "- 回答は省略せず、すべての関連情報や理由を詳細に記述してください。",
        "- 読み手が容易に理解できるよう、論理の流れや結論に至る過程を明示してください。",
        "- 論理の流れ結論に至る過程は最初に<think>...</think>で記述し、その後に回答を記述してください。",
        "",
        "5. **内部の論理構造:**",
        "- あなたの内部的な思考プロセス（内部チェーン・オブ・ソート）は外部に露呈しないようにしながらも、回答にはその論理的根拠が反映されるよう努めてください。",
        "",
        "6. **求めているもの:**",
        "- ユーザーが何を求めているのかを<think>...</think>で記述してから回答を考え、出力するようにする。",
        "- ユーザーの考えていることを<think>...</think>で推論してからメインの考えを出力する。",
        "",
        "以上の指示に従い、各回答において徹底した論理的理由付けと正確な情報の提供を行ってください。",
      ].join("\n");
    }
    // if (search) {
    //   systemMessage += [
    //     "",
    //     "## ツール",
    //     "### search",
    //     "検索ツールを使用して、ユーザーの質問に対する回答を検索してください。このツールは、あなたが知らない知識について、ユーザーに答えるために使用します。",
    //   ].join("\n");
    //
    const bodyContent = {
      model,
      messages: [
        ...[
          {
            role: "system",
            content: systemMessage,
          },
        ],
        ...(messages.map((msg) => {
          if (msg.author == "ai") {
            return {
              role: "assistant",
              content: [{ type: "text", text: msg.message }],
            };
          } else {
            return {
              role: "user",
              content: [{ type: "text", text: msg.message }],
            };
          }
        }) || []),
      ],
    };

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContent),
    });

    return response;
    // if (result.choices[0].finish_reason == "tool_calls") {
    //   const toolCall = result.choices[0].message.tool_calls[0];
    //   if (toolCall.function.name === "search") {
    //     const searchQuery = toolCall.function.arguments;
    //     const searchResult = await fetch(`/api/search`, {
    //       method: "POST",
    //       body: JSON.stringify({
    //         query: searchQuery,
    //       }),
    //     });
    //     const searchResultJson = await searchResult.json();
    //     const searchResultText = searchResultJson.results;
    //     bodyContent.tool_outputs.push({
    //       tool_call_id: toolCall.id,
    //       output: searchResultText,
    //     });

    //     const response = fetch("/api/chat", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(bodyContent),
    //     });
    //   }
    // }
  };

  // refreshCwの修正バージョン
  const refreshCw = async (messageIndex: number, model: string) => {
    if (!currentSession || !currentSession) return;

    try {
      const messages = currentSession.messages;

      // クリックされたメッセージまでのメッセージを保持
      const messagesUpToIndex = messages.slice(0, messageIndex);
      const targetMessage = messages[messageIndex];

      // クリックされたメッセージがAIのメッセージでない場合は処理しない
      if (targetMessage?.author !== "ai") return;

      setIsThinking(true);

      // クリックされたメッセージとそれ以降を削除
      currentSession.messages = messagesUpToIndex;

      const response = await sendChatMessage(messagesUpToIndex);

      if (response.ok) {
        const aiMessage = await response.text();

        currentSession.messages =
          currentSession.messages[currentSession.messages.length - 1]
            ?.author === "ai"
            ? [
                ...currentSession.messages.slice(0, -1),
                {
                  author: "ai",
                  message:
                    aiMessage ||
                    "### エラーが発生しました。APIサーバーがダウンしているか、このモデルは現在オフラインです。",
                  model: model,
                },
              ]
            : [
                ...currentSession.messages,
                {
                  author: "ai",
                  message:
                    aiMessage ||
                    "### エラーが発生しました。APIサーバーがダウンしているか、このモデルは現在オフラインです。",
                  model: model,
                },
              ];
      }
    } catch (error) {
      console.error("Error regenerating response:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
  };

  const handleSendMessage = async (inputMessage: string) => {
    if (inputMessage.trim() === "") return;
    if (!currentSession) return;

    setIsThinking(true);
    const newMessage = inputMessage || "(Image message)";
    const newMessages = [
      ...currentSession.messages,
      { author: "user", message: newMessage } as ChatMessage,
    ];
    currentSession.messages = newMessages;

    try {
      const response = await sendChatMessage(currentSession.messages);
      if (response.ok) {
        const aiMessage = await response.text();

        currentSession.messages =
          currentSession.messages[currentSession.messages.length - 1]
            ?.author === "ai"
            ? [
                ...currentSession.messages.slice(0, -1),
                {
                  author: "ai",
                  message:
                    aiMessage ||
                    "### エラーが発生しました。APIサーバーがダウンしているか、このモデルは現在オフラインです。",
                  model: model,
                },
              ]
            : [
                ...currentSession.messages,
                {
                  author: "ai",
                  message:
                    aiMessage ||
                    "### エラーが発生しました。APIサーバーがダウンしているか、このモデルは現在オフラインです。",
                  model: model,
                },
              ];
      } else {
        currentSession.messages = [
          ...currentSession.messages,
          {
            author: "ai",
            message:
              "### エラーが発生しました。APIサーバーがダウンしているか、このモデルは現在オフラインです。",
          },
        ];
        console.error("Error sending message to server");
      }
      updateSession(currentSession.id, currentSession);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <SidebarProvider className="m-auto">
      <ChatSidebar />

      {/* Sidebar */}

      {/* Main Chat Area */}
      <div
        className={cn(
          "flex flex-col flex-1 w-full md:w-9/12 mr-0 md:mr-16 ml-3 p-4 h-screen"
        )}
      >
        {/* Chat Log */}
        <div className="flex-1 m-auto w-full md:w-9/12 lg:w-7/12 h-screen rounded overflow-y-auto">
          {currentSession && (
            <>
              {currentSession?.messages?.map((log, index) => (
                <MessageLog
                  key={index}
                  log={log}
                  index={index}
                  onRefresh={refreshCw}
                />
              ))}
              {isThinking && (
                <div className="flex w-full message-log visible">
                  <div className="p-2 my-2 rounded-lg text-white w-full">
                    <div className="flex items-start w-full">
                      <div className="p-2 bg-muted rounded-md text-accent-foreground">
                        <Bot />
                      </div>
                      <div className="ml-3 animate-pulse">考え中...</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-4 border p-2 rounded w-full md:w-7/12 m-auto">
          <div className="flex items-center mb-2">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
          <div className="flex items-center gap-1">
            <ModelSelector
              model={model}
              refreshIcon={false}
              handleModelChange={handleModelChange}
              modelDescriptions={modelDescriptions}
            />
            <Button
              className="rounded-full"
              variant={deniThink ? "secondary" : "outline"}
              onClick={() => setDeniThink(!deniThink)}
            >
              <Brain /> DeniThink
            </Button>
            {/* <Button
              className="rounded-full"
              variant={search ? "secondary" : "outline"}
              onClick={() => setSearch(!search)}
            >
              <Search /> 検索
            </Button> */}
          </div>
        </div>
        <Footer />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent className="md:!max-w-xl lg:!max-w-fit">
            <AlertDialogHeader>
              <AlertDialogTitle>サービスの比較</AlertDialogTitle>
              <AlertDialogDescription>
                このページでは、さまざまなサービスを比較して、その性能や特徴を理解することができます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Compare />
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                閉じる
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarProvider>
  );
};

export default ChatApp;
