"use client";

import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onChildAdded,
  orderByChild,
  query,
  equalTo,
} from "firebase/database";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  MessageDataInterface,
  MessageElementDataInterface,
  SubscriptionDataInterface,
  UserDataInterface,
  returnSettingsJson,
} from "@/util/raiChatTypes";
import { auth, firestore } from "@/util/firebaseConfig";
import MessageElement from "@/components/MessageElement";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { useTitle } from "@/hooks/use-title";
import { useParams, useRouter } from "next/navigation";
import { getPlan } from "@/util/rai";

const MessagePage = () => {
  // State Management
  const [isSending, setIsSending] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [myUserObject, setMyUserObject] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [originalMessage, setOriginalMessage] =
    useState<MessageElementDataInterface | null>(null);
  const [replies, setReplies] = useState<MessageElementDataInterface[]>([]);
  const [alertText, setAlertText] = useState("");
  useTitle("メッセージ");
  const params = useParams();
  const router = useRouter();

  // const handleTextAreaChange = useCallback(
  //   debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   }, 150),
  //   []
  // );

  const handleSendReply = async () => {
    if (!messageInput || !myUserObject || isSending) return;
    if (!params) return;
    setIsSending(true);

    try {
      const messageId = params.id as string;
      const token = await myUserObject.getIdToken();
      const response = await fetch("https://api.raic.dev/chat/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ content: messageInput, replyTo: messageId }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          setAlertText("メッセージの送信は60秒に5回までです。");
        }
        return;
      }

      setMessageInput("");
    } finally {
      setIsSending(false);
    }
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

      if (!params) return
      const messageId = params.id as string;
      console.log(messageId);

      // Load message and replies
      const messageQuery = query(
        ref(db, "messages_new_20240630/"),
        orderByChild("id"),
        equalTo(messageId)
      );

      const repliesQuery = query(
        ref(db, "messages_new_20240630/"),
        orderByChild("replyTo"),
        equalTo(messageId)
      );

      const userDoc = await getDoc(doc(dbF, "raichat-user-status", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserDataInterface;
        setIsStaff(userData.isStaff);
      }

      const settingsDoc = await getDoc(doc(dbF, "rai-user-settings", user.uid));
      if (!settingsDoc.exists()) {
        await setDoc(
          doc(dbF, "rai-user-settings", user.uid),
          returnSettingsJson()
        );
      }
      const settingData = settingsDoc.data();

      const subscriptionDoc = await getDoc(
        doc(firestore, "subscription-state", user.uid)
      );
      if (subscriptionDoc.exists()) {
        const subData = subscriptionDoc.data() as SubscriptionDataInterface;

        if (getPlan(subData.plan) != "pro" && getPlan(subData.plan) != "premiumplus") {
          router.push("/");
          return;
        }
      } else {
        router.push("/");
        return;
      }

      const userDocs = await getDocs(collection(dbF, "raichat-user-status"));
      const userMap = new Map(
        userDocs.docs.map((doc) => [doc.id, doc.data() as UserDataInterface])
      );

      onChildAdded(messageQuery, (snapshot) => {
        const messageData = snapshot.val() as MessageDataInterface;
        const userData = userMap.get(messageData.uid);
        if (!userData) return;

        setOriginalMessage({
          userData,
          messageData,
          user,
          userSettings: settingData,
        });
      });

      onChildAdded(repliesQuery, (snapshot) => {
        const messageData = snapshot.val() as MessageDataInterface;
        const userData = userMap.get(messageData.uid);
        if (!userData) return;

        setReplies((prev) => [
          ...prev,
          {
            userData,
            messageData,
            user,
            userSettings: settingData,
          },
        ]);
      });
    };

    onAuthStateChanged(auth, handleAuthStateChanged);
  });

  

  return (
    <main className="p-5 w-full">
      <div className="w-full space-y-4">
        <div className="space-y-4 w-full">
          <h2 className="text-2xl font-bold">元のメッセージ</h2>
          {originalMessage && (
            <MessageElement
              userData={originalMessage.userData}
              messageData={originalMessage.messageData}
              user={originalMessage.user}
              userSettings={originalMessage.userSettings}
              isStaff={isStaff}
            />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">返信</h2>
          <div className="space-y-2">
            <Textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="返信メッセージ"
              className="min-h-[100px]"
            />
            <Button onClick={handleSendReply} disabled={isSending}>
              返信
            </Button>
            {alertText && <p className="text-red-500">{alertText}</p>}
          </div>
          <div className="flex flex-col gap-4">
            {replies.map((reply, index) => (
              <MessageElement
                key={`${reply.messageData.id}-${index}`}
                userData={reply.userData}
                messageData={reply.messageData}
                user={reply.user}
                userSettings={reply.userSettings}
                isStaff={isStaff}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessagePage;
