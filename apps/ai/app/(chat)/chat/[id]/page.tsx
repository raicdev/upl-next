"use client";

import { cn } from "@repo/ui/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import { MessageLog } from "@/components/MessageLog";
import { useChatSessions } from "@/hooks/use-chat-sessions";
import { useParams } from "next/navigation";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { useTransitionRouter } from "next-view-transitions";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import { useChat } from "@ai-sdk/react";
import { uploadResponse, useUploadThing } from "@/utils/uploadthing";
import { auth } from "@repo/firebase/config";
import { useRef, useState, useEffect, Suspense, memo } from "react";
import ChatInput from "@/components/ChatInput";
import HeaderArea from "@/components/HeaderArea";
import { ChatRequestOptions, UIMessage } from "ai";
import logger from "@/utils/logger";
import { useAuth } from "@/context/AuthContext";

interface MessageListProps {
  messages: UIMessage[];
  sessionId: string;
  error?: Error;
}

const MemoizedMessageList = memo(
  ({ messages, sessionId, error }: MessageListProps) => {
    return (
      <>
        {messages.map((message, index) => (
          <MessageLog sessionId={sessionId} key={index} message={message} />
        ))}
        {error && (
          <div className="p-2 my-2 flex gap-2 items-center rounded-lg border border-red-400 text-white w-full md:w-[70%] lg:w-[65%]">
            <AlertCircleIcon size={64} className="text-red-400" />
            <h3 className="font-bold">
              何かしらの問題が発生しました。キャッシュやCookieを削除しても治らない場合は、このモデルはオフラインである可能性があります。
            </h3>
          </div>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.sessionId === nextProps.sessionId &&
      prevProps.error === nextProps.error &&
      JSON.stringify(prevProps.messages) === JSON.stringify(nextProps.messages)
    );
  }
);

MemoizedMessageList.displayName = "MemoizedMessageList";

const ChatApp: React.FC = () => {
  const { updateSession, getSession } = useChatSessions();
  const { user, isLoading } = useAuth();

  const params = useParams<{ id: string }>();
  const currentSession = getSession(params.id);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const router = useTransitionRouter();

  const [searchEnabled, setSearchEnabled] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);

  const [currentAuthToken, setCurrentAuthToken] = useState<string | null>(null);

  const [visionRequired, setVisionRequired] = useState(false);

  const [availableTools, setAvailableTools] = useState<string[]>([]);

  const [model, setModel] = useState("gpt-4o-2024-08-06");
  const [isLogged, setIsLogged] = useState(false);

  const chatLogRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    setMessages,
    status,
    stop,
    error,
    handleSubmit,
  } = useChat({
    onError: (error) => {
      toast.error(error.message);
    },
    body: {
      toolList: availableTools,
      model,
    },
  });

  const { isUploading, startUpload } = useUploadThing("imageUploader", {
    headers: {
      Authorization: currentAuthToken || "",
    },
    onClientUploadComplete: (res) => {
      setImage(res[0]?.ufsUrl || null);
    },
    onUploadError: (error: Error) => {
      toast.error("画像をアップロードできません", {
        description: `エラーが発生しました: ${error.message}`,
      });
    },
  });

  useEffect(() => {
    if (!currentSession) {
      router.push("/home");
      return;
    }

    setMessages(currentSession.messages);
    logger.info("Init", "Loaded Messages");
  }, [currentSession, router, setMessages]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (!isLoading && user) {
      setIsLogged(true);
    }
  }, [isLoading, user, router]);

  // 初期メッセージを別のuseEffectで処理
  useEffect(() => {
    if (!isLogged || !currentSession) return;

    const searchParams = new URLSearchParams(window.location.search);
    const initialMessage = searchParams.get("i");

    if (initialMessage && !messages.length) {
      // メッセージが空の場合のみ初期メッセージを送信
      setInput(initialMessage);
      // 一度だけ実行されるフラグを使用
      const hasSubmitted = sessionStorage.getItem(`submitted_${params.id}`);
      if (!hasSubmitted) {
        sessionStorage.setItem(`submitted_${params.id}`, 'true');
        // 非同期でhandleSubmitを実行
        Promise.resolve().then(() => {
          const event = new Event("submit");
          handleSubmit(event as Event);
        });
      }
    }
  }, [isLogged, currentSession, messages.length, setInput, params.id]); // handleSubmitを依存配列から削除

  useEffect(() => {
    if (
      (status === "streaming" || status === "submitted") &&
      chatLogRef.current
    ) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Monitor input value changes

  const processMessage = (messages: UIMessage[]): UIMessage[] => {
    return messages.map((message) => {
      const newMessage = { ...message };

      if (newMessage.parts && Array.isArray(newMessage.parts)) {
        newMessage.parts = newMessage.parts.filter((part) => {
          return !(part.type === "tool-invocation");
        });
      }

      return newMessage;
    });
  };

  useEffect(() => {
    if (!currentSession) return;
    if (status === "streaming" || status === "submitted") return;
    if (messages.length === 0) return;

    // メッセージの更新を遅延させる
    const timeoutId = setTimeout(() => {
      // 前回のメッセージと比較して変更があった場合のみ更新
      const prevMessages = currentSession.messages;
      const hasChanges =
        JSON.stringify(prevMessages) !== JSON.stringify(messages);

      if (hasChanges) {
        const processedMessages = processMessage([...messages]);
        updateSession(params.id, {
          ...currentSession,
          messages: processedMessages,
        });
      }
    }, 500); // 500ms遅延

    return () => clearTimeout(timeoutId);
  }, [currentSession, messages, params.id, status, updateSession]);

  // 画像メッセージの検出を分離
  useEffect(() => {
    if (
      !visionRequired &&
      messages.some(
        (message) => message.role === "user" && message.experimental_attachments
      )
    ) {
      setVisionRequired(true);
    }
  }, [messages, visionRequired]);

  const handleModelChange = (newModel: string) => {
    if (!modelDescriptions[newModel]?.vision) {
      logger.warn(
        "handleModelChange",
        "Model does not support vision, deleting currently uploaded image..."
      );
      setImage(null);
    }
    logger.info("handleModelChange", "Model changed to" + newModel);
    setModel(newModel);
  };

  const searchToggle = () => {
    setSearchEnabled((prev) => !prev);
  };

  const advancedSearchToggle = () => {
    if (!advancedSearch) {
      toast.info("詳細な検索について", {
        description:
          "詳細な検索はベータ版です。「ウェブサイトを閲覧しました」等をクリックすると、検索結果が表示されます。",
      });
    }
    setAdvancedSearch((prev) => !prev);
  };

  const baseSendMessage = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!currentSession || !input) return;

    let newAvailableTools = [];

    if (searchEnabled) {
      newAvailableTools.push("search");
    }

    if (advancedSearch) {
      newAvailableTools.push("advancedSearch");
    }

    setAvailableTools(newAvailableTools);
    newAvailableTools = [];

    try {
      const submitOptions: ChatRequestOptions = {
        experimental_attachments: image
          ? [{ url: image, contentType: "image/png" }]
          : undefined,
      };

      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        if (!idToken) {
          throw new Error("IDトークンの取得に失敗しました。");
        }
        submitOptions.headers = { Authorization: idToken };
      } else if (modelDescriptions[model]?.canary) {
        throw new Error(
          "このモデルを使用するには、ログインする必要があります。"
        );
      }

      handleSubmit(event, submitOptions);
      setImage(null);
    } catch (error) {
      toast.error("メッセージの送信に失敗しました", {
        description:
          error instanceof Error
            ? error.message
            : "不明なエラーが発生しました。",
      });
    }
  };

  const handleSendMessage = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    baseSendMessage(event);
  };

  const handleSendMessageKey = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      baseSendMessage(event);
    }
  };

  const uploadImage = (file?: File) => {
    return new Promise<uploadResponse>((resolve, reject) => {
      if (!file) {
        resolve({
          status: "error",
          error: {
            message: "ファイルが設定されていません",
            code: "file_not_selected",
          },
        });
        return;
      }

      auth.currentUser?.getIdToken().then((idToken) => {
        if (idToken) {
          setCurrentAuthToken(idToken);
        }

        setTimeout(async () => {
          try {
            const data = await startUpload([
              new File([file], `${crypto.randomUUID()}.png`, {
                type: file.type,
              }),
            ]);

            if (!data) {
              resolve({
                status: "error",
                error: {
                  message: "不明なエラーが発生しました",
                  code: "upload_failed",
                },
              });
              return;
            }

            if (data[0]?.ufsUrl) {
              resolve({
                status: "success",
                data: {
                  url: data[0].ufsUrl,
                },
              });
            } else {
              resolve({
                status: "error",
                error: {
                  message: "不明なエラーが発生しました",
                  code: "upload_failed",
                },
              });
            }
          } catch (error) {
            logger.error("uploadImage", `Something went wrong, ${error}`);
            resolve({
              status: "error",
              error: {
                message: "不明なエラーが発生しました",
                code: "upload_failed",
              },
            });
          }
        }, 1000);
      });
    });
  };

  const handleImagePaste = async (
    event: React.ClipboardEvent<HTMLDivElement>
  ) => {
    if (!modelDescriptions[model]?.vision) return;
    if (!event.clipboardData) return;

    const clipboardData = event.clipboardData;
    if (clipboardData) {
      if (clipboardData.files.length === 0) return;
      const clipboardFile = clipboardData.files[0];
      toast.promise<uploadResponse>(uploadImage(clipboardFile), {
        loading: "画像をアップロード中...",
        success: (uploadResponse: uploadResponse) => {
          if (!uploadResponse.data) return;
          setImage(uploadResponse.data?.url);
          return "画像をアップロードしました";
        },
        error: (uploadResponse: uploadResponse) => {
          logger.error(
            "handleImagePaste",
            "Something went wrong, " + JSON.stringify(uploadResponse.error)
          );
          return uploadResponse.error?.message || "不明なエラーが発生しました";
        },
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!modelDescriptions[model]?.vision) return;

    const files = event.target?.files;
    if (!files) return;

    toast.promise<uploadResponse>(uploadImage(files[0]), {
      loading: "画像をアップロード中...",
      success: (uploadResponse: uploadResponse) => {
        if (!uploadResponse.data) return;
        setImage(uploadResponse.data?.url);
        return "画像をアップロードしました";
      },
      error: (uploadResponse: uploadResponse) => {
        logger.error(
          "handleImagePaste",
          "Something went wrong, " + JSON.stringify(uploadResponse.error)
        );
        return uploadResponse.error?.message || "不明なエラーが発生しました";
      },
    });
  };

  return (
    <main
      className={cn(
        "flex flex-col flex-1 w-full mr-0 p-4 h-screen items-center justify-center"
      )}
    >
      <HeaderArea
        model={model}
        stop={stop}
        generating={status == "submitted" || status == "streaming"}
        handleModelChange={handleModelChange}
      />
      {/* Chat Log */}
      <div
        className="flex w-full h-full md:w-9/12 lg:w-7/12 rounded overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary scrollbar-thumb-rounded-md scrollbar-track-rounded-md"
        ref={chatLogRef}
      >
        <div className="w-full">
          <Suspense fallback={<Loading />}>
            {currentSession && (
              <>
                <MemoizedMessageList
                  messages={messages}
                  sessionId={params.id}
                  error={error}
                />
                {status === "submitted" && (
                  <div className="flex w-full message-log visible">
                    <div className="p-2 my-2 rounded-lg text-white w-full">
                      <div className="ml-3 animate-pulse">
                        {modelDescriptions[model]?.reasoning
                          ? "推論中..."
                          : "考え中..."}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </Suspense>
        </div>
      </div>

      <ChatInput
        input={input}
        image={image}
        isUploading={isUploading}
        searchEnabled={searchEnabled}
        advancedSearch={advancedSearch}
        advancedSearchToggle={advancedSearchToggle}
        searchToggle={searchToggle}
        model={model}
        modelDescriptions={modelDescriptions}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleSendMessageKey={handleSendMessageKey}
        handleImagePaste={handleImagePaste}
        handleImageUpload={handleImageUpload}
        setImage={setImage}
        fileInputRef={fileInputRef}
      />
      <Footer />
    </main>
  );
};

export default ChatApp;
