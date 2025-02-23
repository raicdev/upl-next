"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Bot, Brain, PlusIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/components/button";
import Compare from "@/components/compare";
import { MessageLog } from "@/components/message-log";
import {
  ChatMessage,
  ThinkingEffort,
  useChatSessions,
} from "@/hooks/use-chat-sessions";
import { useParams } from "next/navigation";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { ModelSelector } from "@/components/input-area";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { ChatSidebar } from "@/components/chat-sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";

const ChatApp: React.FC = () => {
  const { updateSession, getSession } = useChatSessions();
  const { messages, input, handleInputChange, handleSubmit } = useChat({});

  const params = useParams<{ id: string }>();
  const currentSession = getSession(params.id);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [visionRequired, setVisionRequired] = useState(false);

  const [model, setModel] = useState("o3-mini");
  const [isOpen, setIsOpen] = useState(false);

  const [isThinking, setIsThinking] = useState(false);
  const [currentThinkEffort, setCurrentThinkEffort] =
    useState<ThinkingEffort>("medium");

  const fallbackMessage =
    "#### 予期しない問題が発生しました。Super Reload (Ctrl+Shift+R) を試しても解決しない場合は、モデルがオフラインになっている可能性があります。";

  useEffect(() => {
    if (!currentSession) {
      router.push("/home");
    }
  }, [currentSession, router]);

  // メッセージ送信のユーティリティ関数
  const sendChatMessage = async (messages: ChatMessage[]) => {
    const systemMessage =
      "Markdownを使用するほうが見やすいと思う場合は、Markdownを使用してください。\n\n";
    // if (search) {
    //   systemMessage += [
    //     "",
    //     "## ツール",
    //     "### search",
    //     "検索ツールを使用して、ユーザーの質問に対する回答を検索してください。このツールは、あなたが知らない知識について、ユーザーに答えるために使用します。",
    //   ].join("\n");
    //
    const modelWithEffort =
      model == "o3-mini"
        ? `${model}${currentThinkEffort == "high" ? "-high" : ""}`
        : model;

    const bodyContent = {
      model: modelWithEffort,
      messages: [
        ...[
          {
            role: "system",
            content: systemMessage,
          },
        ],
        ...(messages.map((msg) => {
          console.log(msg);
          if (msg.author == "ai") {
            return {
              role: "assistant",
              content: [{ type: "text", text: msg.message }],
            };
          } else {
            if (!image) {
              return {
                role: "user",
                content: [{ type: "text", text: msg.message }],
              };
            } else {
              return {
                role: "user",
                content: [
                  { type: "text", text: msg.message },
                  {
                    type: "image",
                    image: new URL(image),
                  },
                ],
              };
            }
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

      const startTime = Date.now();
      const response = await sendChatMessage(messagesUpToIndex);
      const endTime = Date.now();
      const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds

      if (response.ok) {
        const aiMessage = await response.text();

        currentSession.messages =
          currentSession.messages[currentSession.messages.length - 1]
            ?.author === "ai"
            ? [
                ...currentSession.messages.slice(0, -1),
                {
                  author: "ai",
                  message: aiMessage || fallbackMessage,
                  model: model,
                  thinkingEffort:
                    model === "o3-mini" ? currentThinkEffort : undefined,
                  thinkingTime: elapsedTime,
                },
              ]
            : [
                ...currentSession.messages,
                {
                  author: "ai",
                  message: aiMessage || fallbackMessage,
                  model: model,
                  thinkingEffort:
                    model === "o3-mini" ? currentThinkEffort : undefined,
                  thinkingTime: elapsedTime,
                },
              ];
      }
    } catch (error) {
      toast.error("メッセージを送信できませんでした", {
        description: "予期しない問題が発生しました。" + error,
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleModelChange = (newModel: string) => {
    if (!modelDescriptions[newModel]?.vision) {
      setImage(null);
    }
    setModel(newModel);
  };

  const handleSendMessage = async (inputMessage: string) => {
    if (inputMessage.trim() === "") return;
    if (!currentSession) return;

    setIsSending(true);

    if (modelDescriptions[model]?.canary) {
      const currentUses =
        window.localStorage.getItem("experimentalUses") || "0";

      if (parseInt(currentUses) >= 100) {
        toast.error("メッセージを送信できませんでした", {
          description:
            "試験的メッセージの上限へ達しました。これ以上利用したい場合は、サインインしてください。",
          action: (
            <Button asChild>
              <Link href="/signin">サインイン</Link>
            </Button>
          ),
        });

        setIsSending(false);

        return;
      }

      window.localStorage.setItem(
        "experimentalUses",
        (parseInt(currentUses) + 1).toString()
      );
    } else {
      const currentUses = window.localStorage.getItem("normalUses") || "0";

      if (parseInt(currentUses) >= 100) {
        toast.error("メッセージを送信できませんでした", {
          description:
            "メッセージの上限へ達しました。これ以上利用したい場合は、サインインしてください。",
          action: (
            <Button asChild>
              <Link href="/signin">サインイン</Link>
            </Button>
          ),
        });

        setIsSending(false);

        return;
      }

      window.localStorage.setItem(
        "normalUses",
        (parseInt(currentUses) + 1).toString()
      );
    }

    setIsThinking(true);
    const newMessage = inputMessage || "(Image message)";
    const newMessages = [
      ...currentSession.messages,
      { author: "user", message: newMessage, image } as ChatMessage,
    ];
    currentSession.messages = newMessages;

    try {
      const startTime = Date.now();
      const response = await sendChatMessage(newMessages);
      const endTime = Date.now();
      const elapsedTime = (endTime - startTime) / 1000; // Convert to seconds

      const responseBody = response.body;

      if (response.ok && responseBody) {
        const reader = responseBody.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let chunk = "";

        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          chunk += decoder.decode(value, { stream: true });
          if (done) {
            const startIndex = chunk[3] === '{' ? 2 : 3;
            const parsedResponse = JSON.parse(chunk.slice(startIndex));
            currentSession.messages =
              currentSession.messages[currentSession.messages.length - 1]
                ?.author === "ai"
                ? [
                    ...currentSession.messages.slice(0, -1),
                    {
                      author: "ai",
                      message: parsedResponse.text,
                      model: model,
                      thinkingEffort:
                        model === "o3-mini" ? currentThinkEffort : undefined,
                      thinkingTime: elapsedTime,
                    },
                  ]
                : [
                    ...currentSession.messages,
                    {
                      author: "ai",
                      message: parsedResponse.text,
                      model: model,
                      thinkingEffort:
                        model === "o3-mini" ? currentThinkEffort : undefined,
                      thinkingTime: elapsedTime,
                    },
                  ];
          } else {
            let boundary = chunk.indexOf("\n");
            while (boundary !== -1) {
              buffer += chunk.slice(3, boundary - 1);
              chunk = chunk.slice(boundary + 1);
              currentSession.messages =
                currentSession.messages[currentSession.messages.length - 1]
                  ?.author === "ai"
                  ? [
                      ...currentSession.messages.slice(0, -1),
                      {
                        author: "ai",
                        message: buffer,
                        model: model,
                        thinkingEffort:
                          model === "o3-mini" ? currentThinkEffort : undefined,
                        thinkingTime: elapsedTime,
                      },
                    ]
                  : [
                      ...currentSession.messages,
                      {
                        author: "ai",
                        message: buffer,
                        model: model,
                        thinkingEffort:
                          model === "o3-mini" ? currentThinkEffort : undefined,
                        thinkingTime: elapsedTime,
                      },
                    ];
              boundary = chunk.indexOf("\n");
            }
          }
        }      } else {
        currentSession.messages = [
          ...currentSession.messages,
          {
            author: "ai",
            message:
              "#### 予期しない問題が発生しました。Super Reload (Ctrl+Shift+R) を試しても解決しない場合は、モデルがオフラインになっている可能性があります。",
            model: model,
            thinkingEffort:
              model === "o3-mini" ? currentThinkEffort : undefined,
            thinkingTime: elapsedTime,
          },
        ];
      }
      updateSession(currentSession.id, currentSession);
    } catch (error) {
      toast.error("メッセージを送信できませんでした", {
        description: `予期しない問題が発生しました。(${error})`,
      });
    } finally {
      setIsSending(false);
      setIsThinking(false);
    }
  };

  const handleImagePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!modelDescriptions[model]?.vision) return;
    setIsUploading(true);
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const imageFiles = Array.from(clipboardData.files);
      if (imageFiles.length > 0) {
        const imageFile = imageFiles[0];
        if (imageFile) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const imageSrc = e.target?.result;
            if (imageSrc) {
              try {
                const response = await fetch("https://s.kuku.lu/server.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  body:
                    "action=sendScreenShot&format=png&data_b64url=" +
                    encodeURIComponent(imageSrc as string),
                });

                const data = await response.text();

                if (data.indexOf("OK:") === 0) {
                  const url = data.split("OK:")[1];
                  if (url) {
                    const url2 = url.replace("http://s.kuku.lu/", "");
                    const finalUrl = "https://s.kuku.lu/image.php/" + url2;
                    toast.success("画像をアップロードしました");
                    setImage(finalUrl);
                  } else {
                    toast.error("画像のアップロードに失敗しました", {
                      description:
                        "サーバー側でエラーが発生しました。再度お試しください。",
                    });
                  }
                } else {
                  toast.error("画像のアップロードに失敗しました", {
                    description:
                      "サーバー側でエラーが発生しました。再度お試しください。",
                  });
                }
              } catch (error) {
                toast.error("画像のアップロードに失敗しました", {
                  description: `ネットワークエラーが発生しました。再度お試しください。(${error})`,
                });
              } finally {
                setIsUploading(false);
              }
            }
          };
          reader.readAsDataURL(imageFile);
        }
      }
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!modelDescriptions[model]?.vision) return;
    setIsUploading(true);
    const files = event.target?.files;
    if (files && files.length > 0) {
      const imageFile = files[0];
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageSrc = e.target?.result;
          if (imageSrc) {
            try {
              const response = await fetch("https://s.kuku.lu/server.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body:
                  "action=sendScreenShot&format=png&data_b64url=" +
                  encodeURIComponent(imageSrc as string),
              });

              const data = await response.text();

              if (data.indexOf("OK:") === 0) {
                const url = data.split("OK:")[1];
                if (url) {
                  const url2 = url.replace("http://s.kuku.lu/", "");
                  const finalUrl = "https://s.kuku.lu/image.php/" + url2;
                  toast.success("画像をアップロードしました");
                  setImage(finalUrl);
                } else {
                  toast.error("画像のアップロードに失敗しました", {
                    description:
                      "サーバー側でエラーが発生しました。再度お試しください。",
                  });
                }
              } else {
                toast.error("画像のアップロードに失敗しました", {
                  description:
                    "サーバー側でエラーが発生しました。再度お試しください。",
                });
              }
            } catch (error) {
              toast.error("画像のアップロードに失敗しました", {
                description: `ネットワークエラーが発生しました。再度お試しください。${error}`,
              });
            } finally {
              setIsUploading(false);
            }
          }
        };
        reader.readAsDataURL(imageFile);
      }
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
              {currentSession?.messages?.map((log, index) => {
                if (log.image && !visionRequired) {
                  setVisionRequired(true);
                  setModel("o1");
                }

                return (
                  <MessageLog
                    key={index}
                    log={log}
                    index={index}
                    visionRequired={visionRequired}
                    onRefresh={refreshCw}
                  />
                );
              })}
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
          {image && (
            <div className="flex mb-2 rounded border gap-2 w-fit p-1">
              <Image
                src={image}
                width="300"
                height="300"
                alt="Uploaded Image"
              />
              {isUploading && <Loading />}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setImage(null)}
              >
                <XIcon />
              </Button>
            </div>
          )}
          <div className="flex items-center mb-2" onPaste={handleImagePaste}>
            <ChatInput
              onSendMessage={handleSendMessage}
              isSending={isSending}
            />
          </div>
          <div className="flex items-center gap-1">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              className={cn(
                "rounded-full",
                !modelDescriptions[model]?.vision &&
                  "opacity-50 pointer-events-none"
              )}
              onClick={() => fileInputRef.current?.click()}
              title="画像を追加"
            >
              <PlusIcon />
            </Button>
            <ModelSelector
              model={model}
              refreshIcon={false}
              visionRequired={visionRequired}
              handleModelChange={handleModelChange}
              modelDescriptions={modelDescriptions}
            />
            {modelDescriptions[model]?.thinkEfforts && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <Brain />
                    {currentThinkEffort.charAt(0).toUpperCase() +
                      currentThinkEffort.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(modelDescriptions[model]?.thinkEfforts || []).map(
                    (effort) => (
                      <DropdownMenuItem
                        key={effort}
                        onClick={() => {
                          setCurrentThinkEffort(effort);
                          setIsOpen(false);
                        }}
                      >
                        {effort.charAt(0).toUpperCase() + effort.slice(1)}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
