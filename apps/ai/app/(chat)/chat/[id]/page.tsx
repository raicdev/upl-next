"use client";

import { cn } from "@repo/ui/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import { MessageLog } from "@/components/MessageLog";
import { ThinkingEffort, useChatSessions } from "@/hooks/use-chat-sessions";
import { useParams } from "next/navigation";
import { modelDescriptions } from "@/lib/modelDescriptions";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import { useChat } from "@ai-sdk/react";
import { uploadImage } from "@/lib/uploadImage";
import { auth } from "@repo/firebase/config";
import { useRef, useState, useEffect, Suspense, memo } from "react";
import ChatInput from "@/components/ChatInput";

interface MessageListProps {
  messages: any[];
  sessionId: string;
  error: any;
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

  const params = useParams<{ id: string }>();
  const currentSession = getSession(params.id);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [visionRequired, setVisionRequired] = useState(false);

  const [model, setModel] = useState("gpt-4o-2024-08-06");
  const [isLogged, setIsLogged] = useState(false);

  const [currentThinkingEffort, setCurrentThinkingEffort] =
    useState<ThinkingEffort>("medium");

  const chatLogRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    setInput,
    setMessages,
    status,
    error,
    handleSubmit,
  } = useChat({
    experimental_throttle: 100,
    body: {
      model:
        currentThinkingEffort == "high" &&
        modelDescriptions[model]?.thinkingEfforts
          ? model + "-" + currentThinkingEffort
          : model,
    },
  });

  useEffect(() => {
    if (!currentSession) {
      router.push("/home");
      return;
    }

    setMessages(currentSession.messages);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLogged(true);
        toast.success(`${user.displayName}さん、ようこそ！`);
      } else {
        setIsLogged(false);
        router.push("/login");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      (status === "streaming" || status === "submitted") &&
      chatLogRef.current
    ) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Monitor input value changes

  useEffect(() => {
    if (!currentSession) return;
    if (status === "streaming" || status === "submitted") return;

    if (messages.length === 0) return;

    const hasChanges =
      JSON.stringify(currentSession.messages) !== JSON.stringify(messages);

    if (hasChanges) {
      const updatedSession = { ...currentSession, messages };
      updateSession(params.id, updatedSession);
    }

    const imageMessages = messages.filter((message) => {
      return message.role === "user" && message.experimental_attachments;
    });

    if (imageMessages.length > 0 && !visionRequired) {
      setVisionRequired(true);
    }
  }, [currentSession, params.id, status, updateSession, visionRequired]);

  const handleModelChange = (newModel: string) => {
    if (!modelDescriptions[newModel]?.vision) {
      setImage(null);
    }
    setModel(newModel);
  };

  const baseSendMessage = async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (!currentSession) return;

    if (!input) return;

    if (auth.currentUser) {
      const idToken = await auth.currentUser.getIdToken();
      if (!idToken) {
        toast.error("メッセージの送信に失敗しました", {
          description: "申し訳ございません。IDトークンの取得に失敗しました。",
        });
        return;
      }

      handleSubmit(event, {
        headers: {
          Authorization: idToken,
        },
        experimental_attachments: image
          ? [{ url: image, contentType: "image/png" }]
          : undefined,
      });
    } else {
      if (modelDescriptions[model]?.canary) {
        toast.error("メッセージの送信に失敗しました", {
          description:
            "申し訳ございません。このモデルを使用するには、ログインする必要があります。",
        });
        return;
      }

      handleSubmit(event, {
        experimental_attachments: image
          ? [{ url: image, contentType: "image/png" }]
          : undefined,
      });
    }
    currentSession.messages = messages;

    updateSession(currentSession.id, currentSession);

    setImage(null);
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

  const handleImagePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (!modelDescriptions[model]?.vision) return;
    setIsUploading(true);

    const clipboardData = event.clipboardData;
    if (clipboardData) {
      if (clipboardData.files.length === 0) return;
      uploadImage(Array.from(clipboardData.files)).then((data) => {
        if (data.state === "success" && data.url) {
          setImage(data.url);
        } else {
          toast.error("エラーが発生しました", {
            description: data.error?.message || "不明なエラーが発生しました",
          });
        }

        setIsUploading(false);
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
    setIsUploading(true);

    const files = event.target?.files;
    if (!files) return;

    uploadImage(Array.from(files)).then((data) => {
      if (data.state === "success" && data.url) {
        setImage(data.url);
      } else {
        toast.error("エラーが発生しました", {
          description: data.error?.message || "不明なエラーが発生しました",
        });
      }

      setIsUploading(false);
    });
  };

  return (
    <main
      className={cn(
        "flex flex-col flex-1 w-full mr-0 ml-3 p-4 h-screen items-center justify-center"
      )}
    >
      {/* Chat Log */}
      <div
        className="flex w-full h-full md:w-9/12 lg:w-7/12 rounded overflow-y-auto"
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
        model={model}
        visionRequired={visionRequired}
        currentThinkingEffort={currentThinkingEffort}
        modelDescriptions={modelDescriptions}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        handleSendMessageKey={handleSendMessageKey}
        handleImagePaste={handleImagePaste}
        handleImageUpload={handleImageUpload}
        handleModelChange={handleModelChange}
        setImage={setImage}
        setCurrentThinkingEffort={setCurrentThinkingEffort}
        fileInputRef={fileInputRef}
      />
      <Footer />
    </main>
  );
};

export default ChatApp;
