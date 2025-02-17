import { User } from "firebase/auth";
import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";
import { auth, firestore, db } from "@firebase/config";
import MessageSkeleton from "./MessageSkeleton";
import {
  MessageDataInterface,
  MessageElementDataInterface,
  returnSettingsJson,
  UserDataInterface,
  UserSettingsInterface,
} from "@/util/raiChatTypes";
import { SubscriptionDataInterface } from "@firebase/types";
import { getDoc, doc, setDoc, getDocs, collection } from "firebase/firestore";
import {
  orderByChild,
  query,
  ref,
  limitToLast,
  startAt,
  onChildAdded,
  equalTo,
  endAt,
  get,
} from "firebase/database";
import { Loader2 } from "lucide-react";

interface TypeProps {
  type: "default" | "trend" | "other";
  profile?: UserDataInterface;
  replyTo?: string;
}

const MessageElements: React.FC<TypeProps> = ({ type, profile, replyTo }) => {
  const MessageElement = lazy(() => import("./MessageElement"));
  const containerRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<MessageElementDataInterface[]>([]);
  const [messageLimit, setMessageLimit] = useState<number>(25);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザー情報、ユーザー設定、およびユーザーマップの取得
  useEffect(() => {}, []);

  // メッセージリスナーを messageLimit と currentUser の変更時にセットアップ
  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (!user) return;

      let isStaff = false;
      let userSettings = returnSettingsJson() as UserSettingsInterface;

      // ユーザー設定の取得。存在しなければ初期設定を書き込みます。
      const settingsDocRef = doc(firestore, "rai-user-settings", user.uid);
      const settingsSnap = await getDoc(settingsDocRef);
      if (!settingsSnap.exists()) {
        await setDoc(settingsDocRef, returnSettingsJson());
      } else {
        userSettings = settingsSnap.data() as UserSettingsInterface;
      }

      // サブスクリプション状態の取得（isStaff 判定）
      const subscriptionDoc = await getDoc(
        doc(firestore, "subscription-state", user.uid)
      );
      if (subscriptionDoc.exists()) {
        const subData = subscriptionDoc.data() as SubscriptionDataInterface;
        isStaff = subData.isStaff;
      }

      if (!currentUser) return;
      // defaultの場合は limitToLast を messageLimit にして初期25件 (後で上にスクロールしたら増やす)
      // trendの場合は既存のロジックを残す（必要なら別途 pagination を実装してください）
      let messageQuery = undefined;

      if (type === "default") {
        messageQuery = query(
          ref(db, "messages_new_20240630/"),
          orderByChild("id"),
          limitToLast(messageLimit)
        );
      } else if (type === "trend") {
        messageQuery = query(
          ref(db, "messages_new_20240630/"),
          orderByChild("favorite"),
          startAt(2)
        );
      } else if (replyTo) {
        messageQuery = query(
          ref(db, "messages_new_20240630/"),
          orderByChild("replyTo"),
          equalTo(replyTo)
        );
      } else if (profile) {
        messageQuery = query(
          ref(db, "messages_new_20240630/"),
          orderByChild("uid"),
          startAt(profile.uid),
          endAt(user.uid)
        );
      } else {
        messageQuery = query(
          ref(db, "messages_new_20240630/"),
          orderByChild("id"),
          limitToLast(messageLimit)
        );
      }

      // ユーザーマップの作成
      const userDocs = await getDocs(
        collection(firestore, "raichat-user-status")
      );
      const userMap = new Map(
        userDocs.docs.map((docSnap) => [
          docSnap.id,
          docSnap.data() as UserDataInterface,
        ])
      );

      const isReply = replyTo ? true : false;

      // Firebase の onValue を利用して、現在のスナップショットを取得
      const unsubscribeMessages = onChildAdded(messageQuery!, (snapshot) => {
        const messageData = snapshot.val() as MessageDataInterface;
        if (
          !messageData || isReply ? !messageData.replyTo : messageData.replyTo
        )
          return;

        const userData = userMap.get(messageData.uid) as UserDataInterface;
        const newMessage: MessageElementDataInterface = {
          userData,
          messageData,
          user: currentUser,
          userSettings: userSettings,
          isStaff: isStaff,
        };

        setMessages((prevMessages) => [newMessage, ...prevMessages]);
        setIsLoading(false);
      });

      // メッセージがない場合のチェック
      get(messageQuery!).then((snapshot) => {
        if (!snapshot.exists()) {
          setIsLoading(false);
        }
      });
      return () => {
        unsubscribeMessages();
      };
    });

    return () => {
      unsubscribeFromAuth();
    };
  }, [messageLimit, currentUser, type, profile, replyTo]);

  // スクロールイベントを監視し、上部に到達したら messageLimit を拡大
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      // 上端に近づいた場合に messageLimit を増加（例：scrollTop が 50px 以下になったら）
      if (container.scrollTop < 50) {
        setMessageLimit((prev) => prev + 25);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 md:gap-4 overflow-auto h-full"
    >
      {isLoading ? (
        <div className="overflow-hidden">
          <Loader2 size="64" className="animate-spin mx-auto" />
        </div>
      ) : (
        messages.map((msg, index) => (
          <Suspense
            key={`${msg.messageData.id}-${index}`}
            fallback={<MessageSkeleton />}
          >
            <MessageElement
              userData={msg.userData}
              messageData={msg.messageData}
              user={msg.user}
              userSettings={msg.userSettings}
              isStaff={msg.isStaff}
            />
          </Suspense>
        ))
      )}
    </div>
  );
};

export default memo(MessageElements);
