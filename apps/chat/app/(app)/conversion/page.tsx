"use client";

import { useEffect, useState } from "react";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { User } from "firebase/auth";
import {
  SubscriptionDataInterface,
  UserDataInterface,
  returnSettingsJson,
} from "@firebase/types";
import { auth, firestore } from "@firebase/config";
import { useTitle } from "@/hooks/use-title";
import { useRouter } from "next/navigation";
import { Separator } from "@repo/ui/components/separator";
import { Badge } from "@repo/ui/components/badge";
import MessageFollowed from "@/components/MessageFollowed";

const RaiChatApp: React.FC = () => {
  // State Management
  useTitle("ホーム");
  const router = useRouter();

  const [myUserObject, setMyUserObject] = useState<User | null>(null);

  useEffect(() => {
    console.log("useEffect");
    let ignore = false;

    const handleAuthStateChanged = async (user: User | null) => {
      if (ignore) return;
      console.log("handleAuthStateChanged", user);
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


    };
    auth.onAuthStateChanged(handleAuthStateChanged);

    return () => {
      // Cleanup listeners if needed
      const unsubscribe = auth.onAuthStateChanged(() => {});
      unsubscribe();

      ignore = true;
    };
  }, [router]);

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
            <div className="flex flex-col justify-center items-center h-full rounded-md bg-secondary m-auto overflow-y-auto">
              <div>
                <h1 className="text-2xl font-bold">ユーザーを選択</h1>
                <p className="text-muted-foreground">
                  左のサイドバーからユーザーを選択してください
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default RaiChatApp;
