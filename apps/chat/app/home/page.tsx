"use client";

import { useCallback } from "react";
import { useEffect, useState, useRef } from "react";
import { getDatabase } from "firebase/database";
import { getDoc, doc, setDoc, getFirestore } from "firebase/firestore";
import { User } from "firebase/auth";
import {
  MessageElementDataInterface,
  SubscriptionDataInterface,
  UserDataInterface,
  returnSettingsJson,
} from "@/util/raiChatTypes";
import { auth, firestore } from "@firebase/config";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Label } from "@workspace/ui/components/label";
import { useTitle } from "@/hooks/use-title";
import { useRouter } from "next/navigation";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/alert";
import Link from "next/link";
import { RefreshCw, X } from "lucide-react";
import Image from "next/image";
import MessageElements from "@/components/MessageElements";

const RaiChatApp: React.FC = () => {
  // State Management
  useTitle("ホーム");
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [myUserObject, setMyUserObject] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [alertText, setAlertText] = useState("");

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const messageSentContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Add these new functions before the RaiChatApp component
  const uploadImage = async (file: File) => {
    const blobToBase64 = (blob: Blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };

    const base64Data = (await blobToBase64(file)) as string;

    try {
      const response = await fetch("https://s.kuku.lu/server.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "action=sendScreenShot&format=png&data_b64url=" +
          encodeURIComponent(base64Data),
      });

      const data = await response.text();

      if (data.indexOf("OK:") === 0) {
        const url = data.split("OK:")[1];
        if (url) {
          const url2 = url.replace("http://s.kuku.lu/", "");
          const finalUrl = "https://s.kuku.lu/image.php/" + url2;
          return { url: finalUrl };
        } else {
          throw new Error(
            "サーバ側でエラーが発生しました。再度お試しください。"
          );
        }
      } else {
        throw new Error("サーバ側でエラーが発生しました。再度お試しください。");
      }
    } catch (error) {
      throw new Error(
        `ネットワークエラーが発生しました。再度お試しください。${error}`
      );
    }
  };

  // Inside RaiChatApp component, add this new handler
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      if (imagePreview) return;

      const items = e.clipboardData.items;
      const imageItem = Array.from(items).find(
        (item) => item.type.indexOf("image") !== -1
      );

      if (imageItem) {
        e.preventDefault();
        setIsSending(true);

        try {
          const file = imageItem.getAsFile();
          if (!file) return;

          // プレビュー用のURL生成
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);

          const result = await uploadImage(file);
          setMessageInput((prev) => prev + "\n\n[img]" + result.url + "[/img]");
        } catch (error) {
          setAlertText(`画像のアップロードに失敗しました。${error}`);
        } finally {
          setIsSending(false);
        }
      }
    },
    [setMessageInput, setIsSending, setAlertText, imagePreview]
  );

  const handleSendMessage = async () => {
    if (!messageInput) {
      setAlertText("メッセージを入力してください。");
      return;
    }
    if (!messageInput || !myUserObject || isSending) return;
    setIsSending(true);

    try {
      const token = await myUserObject.getIdToken();
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ content: messageInput }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          setAlertText("メッセージの送信は60秒に5回までです。");
        }
        return;
      }

      setMessageInput("");
      setImagePreview(null);
    } finally {
      setIsSending(false);
    }
  };

  // const handleSearch = (value: string) => {
  //   // setSearchInput(value);
  //   // const searchLower = value.toLowerCase();
  //   // const isPremiumSearch = searchLower.includes("[premium]");
  //   // const isStudentSearch = searchLower.includes("[student]");

  //   // setMessages((prevMessages) =>
  //   //   prevMessages.map((msg) => ({
  //   //     ...msg,
  //   //     hidden: !shouldShowMessage(
  //   //       msg,
  //   //       searchLower,
  //   //       isPremiumSearch,
  //   //       isStudentSearch
  //   //     ),
  //   //   }))
  //   // );

  //   alert("search is currently disabled");
  // };

  // const shouldShowMessage = (
  //   msg: MessageElementDataInterface,
  //   search: string,
  //   isPremium: boolean,
  //   isStudent: boolean
  // ) => {
  //   const messageText = msg.messageData.message.toLowerCase();
  //   const basicMatch = messageText.includes(search);

  //   if (isPremium && !msg.userData.verified) return false;
  //   if (isStudent && !msg.userData.isStudent) return false;

  //   return basicMatch;
  // };

  useEffect(() => {
    const handleAuthStateChanged = async (user: User | null) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      setMyUserObject(user);

      // User settings
      const settingsDoc = await getDoc(
        doc(firestore, "rai-user-settings", user.uid)
      );
      if (!settingsDoc.exists()) {
        await setDoc(
          doc(firestore, "rai-user-settings", user.uid),
          returnSettingsJson()
        );
      }
      const settingData = settingsDoc.data();

      // Subscription status
      const subscriptionDoc = await getDoc(
        doc(firestore, "subscription-state", user.uid)
      );
      if (subscriptionDoc.exists()) {
        const subData = subscriptionDoc.data() as SubscriptionDataInterface;

        if ((subData.plan as string) != "free") {
          const userDoc = await getDoc(
            doc(firestore, "raichat-user-status", user.uid)
          );
          if (userDoc.exists() && settingData) {
            const userData = userDoc.data() as UserDataInterface;
            userData.checkmarkState = settingData.hide_checkmark;
            await setDoc(
              doc(firestore, "raichat-user-status", user.uid),
              userData
            );
          }
        }
      } else {
        router.push("/");
        return;
      }
    };

    auth.onAuthStateChanged(handleAuthStateChanged);

    return () => {
      // Cleanup listeners if needed
    };
  }, [router]);

  return (
    <main className={`p-3 md:p-5 h-full flex flex-col`}>
      <div id="app-content" className="w-full h-full" ref={contentRef}>
        <div className="field space-y-2" ref={messageSentContainerRef}>
          <div className="control flex flex-col mb-3 gap-2">
            <div className="flex-1 border rounded-md h-auto">
              <textarea
                ref={inputRef}
                value={messageInput}
                onChange={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                  setMessageInput(e.target.value)
                }}
                onPaste={handlePaste}
                className="w-full border-none bg-transparent p-3 h-auto min-h-0 outline-none text-sm resize-none overflow-hidden"
                placeholder="メッセージを入力して送信。Ctrl+Vで画像を追加。"
                style={{ height: 'auto', overflow: 'hidden' }}
              />              {imagePreview && (
                <div className="m-2 border bg-sidebar flex flex-col gap-1 rounded-md w-fit p-1 pl-2 pb-1">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="w-full"
                    onClick={() => setImagePreview(null)}
                  />
                  <div className="flex justify-between items-center">
                    <p>画像が添付済み</p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setImagePreview(null);
                        setMessageInput(
                          messageInput.replace(/\[img\].*?\[\/img\]/g, "")
                        );
                      }}
                    >
                      <X /> 削除
                    </Button>
                  </div>
                </div>
              )}
            </div>            <Button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isSending}
              className="w-full md:w-24 h-10"
            >
              送信
            </Button>
          </div>
          <Label htmlFor="message" className="hidden">
            {alertText}
          </Label>
        </div>

        <div className="space-y-3">
          <Tabs defaultValue="home">
            <TabsList className="w-full justify-start md:justify-center gap-1">
              <TabsTrigger value="home" className="flex-1 md:flex-none">
                最新
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex-1 md:flex-none">
                トレンド
              </TabsTrigger>
              {/* <TabsTrigger value="following" className="flex-1 md:flex-none">
                フォロー中
              </TabsTrigger> */}
            </TabsList>
            <TabsContent value="home">
              <MessageElements type="default" />
            </TabsContent>
            <TabsContent value="trend">
              <MessageElements type="trend" />
            </TabsContent>
            {/* <TabsContent value="following">
              <div
                className="flex flex-col gap-4"
                ref={timelineFollowingRef}
              >
                {followingMessages.map((msg, index) => (
                  <MessageElement
                    key={`${msg.messageData.id}-${index}`}
                    userData={msg.userData}
                    messageData={msg.messageData}
                    user={msg.user}
                    userSettings={msg.userSettings}
                    isStaff={isStaff}
                  />
                ))}
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default RaiChatApp;
