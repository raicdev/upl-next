"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Label } from "@repo/ui/components/label";
import { Switch } from "@repo/ui/components/switch";
import Link from "next/link";
import { auth, firestore } from "@repo/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  returnSettingsJson,
  SubscriptionDataInterface,
} from "@repo/firebase/types";
import { Badge } from "@repo/ui/components/badge";
import { useTitle } from "@/hooks/use-title";
import { useRouter } from "next/navigation";
import { getPlan } from "@repo/firebase/tools";
import { BadgeCheck } from "lucide-react";

const Settings: React.FC = () => {
  // State Management
  const router = useRouter();
  const [raiMarkdown, setRaiMarkdownI] = useState(true);
  const [premiumEdit, setPremiumEdit] = useState(false);
  const [premiumCheckmark, setPremiumCheckmark] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [userObject, setUserObject] = useState({} as User);

  useTitle("設定");

  const setRaiMarkdown = () => {
    setRaiMarkdownI(!raiMarkdown);
    editSettings("raiMarkdown", !raiMarkdown);
  };

  const setEdit = () => {
    setPremiumEdit(!premiumEdit);
    editSettings("premiumEdit", !premiumEdit);
  };

  const setCheckmark = () => {
    editSettings("hide_checkmark", !premiumCheckmark);
    setPremiumCheckmark(!premiumCheckmark);
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserObject(user);

        const settingDoc = await getDoc(
          doc(firestore, "rai-user-settings", user.uid)
        );
        if (!settingDoc.exists()) {
          await setDoc(
            doc(firestore, "rai-user-settings", user.uid),
            returnSettingsJson()
          );
        }
        const settingData = settingDoc.data();
        if (settingData) {
          setRaiMarkdownI(settingData.markdown);
        }

        const premiumDoc = await getDoc(
          doc(firestore, "subscription-state", user.uid)
        );
        if (premiumDoc.exists()) {
          const subData = premiumDoc.data() as SubscriptionDataInterface;
          setIsPremium((subData.plan as string) != "free");
          if (settingData) {
            setPremiumEdit(settingData.premiumEdit);
            setPremiumCheckmark(settingData.hide_checkmark);
          }
        }
      } else {
        window.location.href = "/login";
      }
    });
  });

  const editSettings = async (
    setting: string,
    value: boolean | string | number
  ) => {
    setIsChanging(true);

    const settingsDoc = doc(firestore, "rai-user-settings", userObject.uid);
    const settingDoc = await getDoc(settingsDoc);
    const settingData = settingDoc.data();
    if (settingData) {
      settingData[setting] = value;
      await setDoc(settingsDoc, settingData);

      setIsChanging(false);
    }
  };

  return (
    <main className={`p-3 md:p-5 w-full`}>
      <h1 className="text-2xl md:text-4xl font-bold mb-2">Rai Chat の設定</h1>
      <p className="text-sm md:text-base mb-4">機能の有効／無効を切り替えたりすることができます。</p>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="general">一般</TabsTrigger>
          <TabsTrigger value="feature">機能</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="flex flex-col gap-4">
            <div className="bg-card border shadow w-auto p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Switch
                  id="rai-markdown"
                  checked={raiMarkdown}
                  disabled={isChanging}
                  onCheckedChange={() => setRaiMarkdown()}
                />
                <Label htmlFor="rai-markdown" className="text-xl">
                  Rai Markdown
                </Label>
              </div>
              <p>
                Rai Markdown は、Rai Chat
                用に開発された分かりやすいMarkdownです。
              </p>
              <ul className="list-disc ml-4 md:ml-6 mb-1 text-sm md:text-base">
                <li>
                  <code>[b]太字[/b]</code> で太字になります。
                </li>
                <li>
                  <code>[i]斜体[/i]</code> で斜体になります。
                </li>
                <li>
                  <code>[s]打ち消し線[/s]</code> で打ち消し線になります。
                </li>
                <li>
                  <code>[url]リンク[/url]</code> でリンクになります。
                </li>
                <li>
                  <BadgeCheck className="inline-block mr-1 text-yellow-500 dark:text-yellow-400" />
                  <code>[img]画像リンク[/img]</code> で画像になります。
                </li>
                <li>
                  <BadgeCheck className="inline-block mr-1 text-yellow-500 dark:text-yellow-400" />
                  <code>[color=色(HEX)]色[/color]</code>{" "}
                  で色付きテキストになります。
                </li>
              </ul>
            </div>

            <div className="bg-card shadow border w-auto p-3 md:p-4 rounded-lg">
              <Label className="text-lg md:text-xl">アカウントの設定</Label>
              <p className="text-sm md:text-base mt-2 mb-3">
                アカウントの設定・サブスクリプションの変更は、
                以下のリンクから可能です。
              </p>
              <Button asChild>
                <Link href="/account">
                  アカウントの設定
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="feature">
          <div className="flex flex-col gap-4">
            <div className="bg-card border shadow w-auto p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Switch
                  id="premium-edit"
                  checked={premiumEdit}
                  disabled={isChanging || !isPremium}
                  onCheckedChange={() => setEdit()}
                />
                <Label
                  htmlFor="premium-edit"
                  className="text-lg md:text-xl items-center flex"
                >
                  メッセージの編集 <Badge className="ml-1">プレミアム</Badge>
                </Label>
              </div>
              {isPremium ? (
                <p className="text-sm md:text-base mt-2">
                  メッセージの編集機能を有効にします。メッセージの編集は、メッセージの編集を有効にする前のメッセージも編集することができます。
                  <br />
                  ただし、メッセージを編集した場合は、メッセージを編集したことがわかるアイコンがメッセージに追加されます。
                </p>
              ) : (
                <p>
                  メッセージの編集機能を有効にするには、プレミアム以上のサブスクリプションに登録する必要があります。
                </p>
              )}
            </div>

            <div className="bg-card border shadow w-auto p-3 md:p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Switch
                  id="premium-checkmark"
                  checked={premiumCheckmark}
                  disabled={isChanging || !isPremium}
                  onCheckedChange={() => setCheckmark()}
                />
                <Label
                  htmlFor="premium-checkmark"
                  className="text-lg md:text-xl items-center flex"
                >
                  チェックマークを隠す{" "}
                  <Badge className="ml-1">プレミアム</Badge>
                </Label>
              </div>
              {isPremium ? (
                <p className="text-sm md:text-base mt-2">
                  チェックマークを隠す機能を有効にします。このオプションを有効にした場合は、メッセージ、プロフィール、DMなどでチェックマークは隠されますが、
                  <br />
                  一部の機能を使用すると有料サブスクリプションを所持していることが他のユーザーに分かる場合があります。
                </p>
              ) : (
                <p>
                  チェックマークを有効にするには、プレミアム以上のサブスクリプションに登録する必要があります。
                </p>
              )}
            </div>

            <div className="bg-card shadow border w-auto p-4 rounded-lg">
              <Label className="text-xl">アカウントの設定</Label>
              <p className="mb-1">
                アカウントの設定・サブスクリプションの変更は、
                以下のリンクから可能です。
              </p>
              <Button asChild>
                <Link href="/account">
                  アカウントの設定
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Settings;
