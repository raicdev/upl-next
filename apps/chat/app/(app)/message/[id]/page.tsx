"use client";

import { useEffect, useState } from "react";
import { ref, orderByChild, query, equalTo, get } from "firebase/database";
import { getDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  MessageDataInterface,
  MessageElementDataInterface,
  UserDataInterface,
  UserSettingsInterface,
  returnSettingsJson,
} from "@firebase/types";
import { auth, firestore, db } from "@firebase/config";
import MessageElement from "@/components/MessageElement";
import { Textarea } from "@repo/ui/components/textarea";
import { Button } from "@repo/ui/components/button";
import { useTitle } from "@/hooks/use-title";
import { useParams } from "next/navigation";
import MessageSkeleton from "@/components/MessageSkeleton";
import MessageElements from "@/components/MessageElements";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const MessagePage = () => {
  // State Management
  const [isSending, setIsSending] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [myUserObject, setMyUserObject] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [originalMessage, setOriginalMessage] =
    useState<MessageElementDataInterface | null>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
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
      const response = await fetch("/api/reply", {
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
    const handleAuthStateChanged = async (user: User | null) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      setMyUserObject(user);

      if (!params) return;
      const messageId = params.id as string;
      setMessageId(messageId);
      // Load message and replies
      const messageQuery = query(
        ref(db, "messages_new_20240630/"),
        orderByChild("id"),
        equalTo(messageId)
      );

      const userDoc = await getDoc(
        doc(firestore, "raichat-user-status", user.uid)
      );
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserDataInterface;
        setIsStaff(userData.isStaff);
      }

      const settingsDoc = await getDoc(
        doc(firestore, "rai-user-settings", user.uid)
      );
      if (!settingsDoc.exists()) {
        await setDoc(
          doc(firestore, "rai-user-settings", user.uid),
          returnSettingsJson() as UserSettingsInterface
        );
      }
      const settingData = settingsDoc.data() as UserSettingsInterface;

      const userDocs = await getDocs(
        collection(firestore, "raichat-user-status")
      );
      const userMap = new Map(
        userDocs.docs.map((doc) => [doc.id, doc.data() as UserDataInterface])
      );

      get(messageQuery).then((snapshot) => {
        if (snapshot.exists()) {
          const snapshotValue = snapshot.val();
          if (snapshotValue) {
            const messageData = snapshotValue[
              Object.keys(snapshotValue)[0]!
            ] as MessageDataInterface;
            const userData = userMap.get(messageData.uid);
            if (!userData) return;

            setOriginalMessage({
              userData,
              messageData,
              user,
              userSettings: settingData,
              isStaff: isStaff,
            });

            setIsLoading(false);
          }
        }
      });
    };

    const unsubscribeAuth = onAuthStateChanged(auth, handleAuthStateChanged);

    return () => {
      // onAuthStateChanged のリスナー解除
      unsubscribeAuth();
      // onChildAdded のリスナー解除
    };
  }, [isStaff, params]);

  return (
    <main className="p-5 w-full">
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center rounded-md border px-4 py-2">
          <h1>メッセージ</h1>
          <Button variant="secondary" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        </div>
        <div className="space-y-4 w-full">
          <h2 className="text-2xl font-bold">元のメッセージ</h2>
          {isLoading ? <MessageSkeleton /> : null}
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
            <Button onClick={handleSendReply} size="lg" disabled={isSending}>
              返信
            </Button>
            {alertText && <p className="text-red-500">{alertText}</p>}
          </div>
          <MessageElements type="other" replyTo={messageId as string} />
        </div>
      </div>
    </main>
  );
};

export default MessagePage;
