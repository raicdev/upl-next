"use client";

import { useEffect, useState } from "react";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import {
  SubscriptionDataInterface,
  UserDataInterface,
  returnSettingsJson,
} from "@repo/firebase/types";
import { auth, db, firestore } from "@repo/firebase/config";
import { useTitle } from "@/hooks/use-title";
import { useRouter } from "next/navigation";
import { Separator } from "@repo/ui/components/separator";
import { Badge } from "@repo/ui/components/badge";
import { useParams } from "next/navigation";
import MessageFollowed from "@/components/MessageFollowed";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import { SendIcon } from "lucide-react";
import { onChildAdded, ref } from "firebase/database";
import { toast } from "sonner";

const RaiChatApp: React.FC = () => {
  // State Management
  useTitle("ホーム");
  const router = useRouter();
  const params = useParams();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [myUserObject, setMyUserObject] = useState<User | null>(null);
  const [targetUser, setTargetUser] = useState<UserDataInterface | null>(null);
  const [messages, setMessages] = useState<
    { message: string; date: string; uid: string }[]
  >([]);

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
      }

      const conversationId = [params.id, user.uid].sort().join('-');
      const conversationRef = ref(db, `conversations/${conversationId}`);

      onChildAdded(conversationRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message: data.message,
              date: data.date,
              uid: data.uid,
            },
          ]);
        }
      });

      // Get target user data
      const targetUserDoc = await getDoc(
        doc(firestore, "raichat-user-status", params.id as string)
      );
      if (targetUserDoc.exists()) {
        const targetUserData = targetUserDoc.data() as UserDataInterface;
        setTargetUser(targetUserData);
      } else {
        router.back();
      }
    };

    auth.onAuthStateChanged(handleAuthStateChanged);

    return () => {
      // Cleanup listeners if needed
      // For example, you might want to unsubscribe from auth state changes
      const unsubscribe = auth.onAuthStateChanged(() => {});
      unsubscribe();
    };
  }, [params.id, router]);

  const handleSend = async () => {
    if (!message) return;
    if (!myUserObject) return;
    setIsSending(true);

    const newMessage = {
      message,
      date: new Date().toISOString(),
      uid: myUserObject.uid,
    };

    const token = await myUserObject.getIdToken();
    const response = await fetch("/api/beta/conversion/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ content: message, conversion: `${params.id}-${myUserObject.uid}` }),
    });

    if (!response.ok) {
      toast.error("メッセージを送信できませんでした", {
        description: "メッセージの送信は現在制限中です。再度お試しください。",
      });
      return;
    }

    toast.success("メッセージを送信しました");
  };

  return (
    <main className={`p-3 md:p-5 h-full flex flex-col`}>
      <div id="app-content" className="w-full h-full">
        <div className="mb-2 flex gap-2 items-center">
          <h1 className="text-4xl font-bold">メッセージ</h1>
          <Badge className="h-fit">ベータ</Badge>
        </div>
        <Separator className="mb-2 h-1" />
        <div className="flex h-full gap-2">
          <MessageFollowed userId={myUserObject?.uid} />

          <div className="field w-6/8 space-y-2 h-[calc(100vh-200px)]">
            <div className="bg-secondary h-full rounded-md p-2">
              <h1 className="text-2xl font-bold">
                {targetUser?.username} との会話
              </h1>
              <Separator className="bg-sidebar rounded h-1 my-2 w-full" />
              <div className="w-full h-[calc(100%-110px)] overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col rounded-md border-2 w-fit p-2",
                      message.uid === myUserObject?.uid
                        ? "ml-auto bg-sidebar-primary"
                        : "mr-auto border-sidebar-foreground"
                    )}
                  >
                    <div className="flex flex-row">
                      <div className="text-sm">{message.message}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border border-gray-400 mt-auto flex flex-row rounded-md p-2">
                <input
                  placeholder="メッセージを入力"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full outline-none"
                />
                <Button disabled={isSending} onClick={handleSend} size="icon">
                  <SendIcon className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RaiChatApp;
