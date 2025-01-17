"use client";

import { debounce } from "lodash";
import { useCallback } from "react";
import { useEffect, useState, useRef } from "react";
import {
  getDatabase,
  ref,
  onChildAdded,
  orderByChild,
  query,
  startAt,
  limitToLast,
} from "firebase/database";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { User } from "firebase/auth";
import {
  MessageDataInterface,
  MessageElementDataInterface,
  SubscriptionDataInterface,
  UserDataInterface,
  returnSettingsJson,
} from "@/util/raiChatTypes";
import { auth } from "@firebase/config";
import MessageElement from "@/components/MessageElement";
import { Textarea } from "@shadcn/textarea";
import { Button } from "@shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { useTitle } from "@/hooks/use-title";
import { useRouter } from "next/navigation";
import { getPlan } from "@/util/rai";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@workspace/ui/components/alert";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

const RaiChatApp: React.FC = () => {
  // State Management
  useTitle("ホーム");
  const router = useRouter();

  const [isSending, setIsSending] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [myUserObject, setMyUserObject] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageElementDataInterface[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [followingMessages, setFollowingMessages] = useState<
    MessageElementDataInterface[]
  >([]);
  const [trendMessages, setTrendMessages] = useState<
    MessageElementDataInterface[]
  >([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [alertText, setAlertText] = useState("");

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const messageSentContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineTrendRef = useRef<HTMLDivElement>(null);
  const timelineFollowingRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessageInput(e.target.value);
    }, 150),
    [setMessageInput]
  );

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
      throw new Error("ネットワークエラーが発生しました。再度お試しください。");
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
          setMessageInput((prev) => prev + "[img]" + result.url + "[/img]");
          console.log(messageInput);
        } catch (error) {
          setAlertText("画像のアップロードに失敗しました。");
        } finally {
          setIsSending(false);
        }
      }
    },
    [setMessageInput, setIsSending, setAlertText, imagePreview, imagePreview]
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
      const response = await fetch("https://api.raic.dev/chat/send", {
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

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const searchLower = value.toLowerCase();
    const isPremiumSearch = searchLower.includes("[premium]");
    const isStudentSearch = searchLower.includes("[student]");

    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({
        ...msg,
        hidden: !shouldShowMessage(
          msg,
          searchLower,
          isPremiumSearch,
          isStudentSearch
        ),
      }))
    );
  };

  const shouldShowMessage = (
    msg: MessageElementDataInterface,
    search: string,
    isPremium: boolean,
    isStudent: boolean
  ) => {
    const messageText = msg.messageData.message.toLowerCase();
    const basicMatch = messageText.includes(search);

    if (isPremium && !msg.userData.verified) return false;
    if (isStudent && !msg.userData.isStudent) return false;

    return basicMatch;
  };

  useEffect(() => {
    const db = getDatabase();
    const dbF = getFirestore();

    const handleAuthStateChanged = async (user: User | null) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      setMyUserObject(user);

      // User settings
      const settingsDoc = await getDoc(doc(dbF, "rai-user-settings", user.uid));
      if (!settingsDoc.exists()) {
        await setDoc(
          doc(dbF, "rai-user-settings", user.uid),
          returnSettingsJson()
        );
      }
      const settingData = settingsDoc.data();

      // Subscription status
      const subscriptionDoc = await getDoc(
        doc(dbF, "subscription-state", user.uid)
      );
      if (subscriptionDoc.exists()) {
        const subData = subscriptionDoc.data() as SubscriptionDataInterface;
        setIsStaff(subData.isStaff);

        if (
          getPlan(subData.plan) != "pro" &&
          getPlan(subData.plan) != "premiumplus"
        ) {
          router.push("/");
          return;
        }

        if ((subData.plan as string) != "free") {
          const userDoc = await getDoc(
            doc(dbF, "raichat-user-status", user.uid)
          );
          if (userDoc.exists() && settingData) {
            const userData = userDoc.data() as UserDataInterface;
            userData.checkmarkState = settingData.hide_checkmark;
            await setDoc(doc(dbF, "raichat-user-status", user.uid), userData);
          }
        }
      } else {
        router.push("/");
        return;
      }

      // Message listeners
      const messagesQuery = query(
        ref(db, "messages_new_20240630/"),
        orderByChild("id"),
        limitToLast(30)
      );
      const trendQuery = query(
        ref(db, "messages_new_20240630/"),
        orderByChild("favorite"),
        startAt(2)
      );

      const userDocs = await getDocs(collection(dbF, "raichat-user-status"));
      const userMap = new Map(
        userDocs.docs.map((doc) => [doc.id, doc.data() as UserDataInterface])
      );

      onChildAdded(messagesQuery, (snapshot) => {
        const messageData = snapshot.val() as MessageDataInterface;
        if (messageData.replyTo) return;

        const userData = userMap.get(messageData.uid);
        if (!userData) return;

        const newMessage: MessageElementDataInterface = {
          userData,
          messageData,
          user: user,
          userSettings: settingData,
        };

        setMessages((prev) => [newMessage, ...prev]);
      });

      onChildAdded(trendQuery, (snapshot) => {
        const messageData = snapshot.val() as MessageDataInterface;
        if (messageData.replyTo) return;

        const userData = userMap.get(messageData.uid);
        if (!userData) return;

        const newMessage: MessageElementDataInterface = {
          userData,
          messageData,
          user: user,
          userSettings: settingData,
        };

        setTrendMessages((prev) => [newMessage, ...prev]);
      });
    };

    auth.onAuthStateChanged(handleAuthStateChanged);

    return () => {
      // Cleanup listeners if needed
    };
  }, [router]);

  return (
    <main className={`p-3 md:p-5 w-full`}>
      <div id="app-content" className="w-full h-full" ref={contentRef}>
        <div className="flex flex-col items-center justify-center mt-2 md:mt-4 mb-2 md:mb-3 w-full">
          <Alert className="w-full text-sm md:text-base">
            <RefreshCw className="h-4 w-4" />
            <AlertTitle>Rai Chat の利用規約が更新されます</AlertTitle>
            <AlertDescription>
              Rai Chat
              の利用規約が更新され、2025/01/20から使用されます。新しい規約は、{" "}
              <Link
                href="/terms"
                className="text-blue-500 dark:text-blue-400 hover:underline"
              >
                こちら
              </Link>
              でご確認ください。
            </AlertDescription>
          </Alert>
        </div>
        <div className="field space-y-2" ref={messageSentContainerRef}>
          <div className="control flex flex-col mb-3 gap-2">
            <div className="flex-1">
              <Textarea
                ref={inputRef}
                onChange={handleTextAreaChange}
                onPaste={handlePaste}
                className="min-h-[100px] md:min-h-[120px]"
                placeholder="メッセージを入力して送信。Ctrl+Vで画像を追加。"
              />
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-[150px] md:max-w-[200px] rounded-md cursor-pointer"
                    onClick={() => setImagePreview(null)}
                  />
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={(e) => {
                console.log("Button click event:", e);
                handleSendMessage();
              }}
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
          <Input
            type="text"
            value={searchInput}
            className="w-full"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ワード、名前、時間で検索"
          />

          <Tabs defaultValue="home">
            <TabsList className="w-full justify-start md:justify-center gap-1">
              <TabsTrigger value="home" className="flex-1 md:flex-none">
                最新
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex-1 md:flex-none">
                トレンド
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1 md:flex-none">
                フォロー中
              </TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <div
                className="flex flex-col gap-2 md:gap-4"
                ref={timelineRef}
              >
                {messages.map((msg, index) => (
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
            </TabsContent>
            <TabsContent value="trend">
              <div
                className="flex flex-col gap-4 trend"
                ref={timelineTrendRef}
              >
                {trendMessages.map((msg, index) => (
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
            </TabsContent>
            <TabsContent value="following">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default RaiChatApp;
