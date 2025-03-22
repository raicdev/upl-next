"use client";

import { Separator } from "@repo/ui/components/separator";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { updateProfile } from "firebase/auth";
import { Input } from "@repo/ui/components/input";
import { Switch } from "@repo/ui/components/switch";

export default function AccountSettingsPage() {
  const { user, isLoading } = useAuth();
  const [isLogged, setIsLogged] = useState(false);
  const [name, setName] = useState("");
  const [privacyMode, setPrivacyMode] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // 初期値の設定
    const privacyMode = window.localStorage.getItem("privacyMode");
    setPrivacyMode(privacyMode === "true");

    if (!user && !isLoading) {
      router.push("/");
    }

    if (user && !isLoading) {
      setIsLogged(true);
      setName(privacyMode ? user.displayName || "" : "");
    }
  }, [user, isLoading, router]);

  const handleChangeName = async () => {
    if (!user) return;

    if (!name) {
      toast.error("名前を入力してください");
      return;
    }

    try {
      await updateProfile(user, {
        displayName: name,
      });

      toast.success("名前を変更しました");
    } catch (error: any) {
      toast.error("名前の変更に失敗しました", {
        description: error.message,
      });
    }
  };

  function togglePrivacyMode() {
    const newValue = !privacyMode;
    window.localStorage.setItem("privacyMode", newValue ? "true" : "false");
    setPrivacyMode(newValue);
    // カスタムイベントをディスパッチ
    window.dispatchEvent(
      new CustomEvent("privacyModeChange", { detail: newValue })
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">アカウントの管理</h2>
        <p className="text-sm text-muted-foreground mb-2">
          あなたのアカウントを管理します。
        </p>

        {isLogged && (
          <div className="w-full bg-secondary shadow rounded-sm pb-0 mb-3">
            <div className="flex p-4 items-center gap-2">
              <div>
                <h3 className="text-lg font-bold">名前を変更</h3>
                <p className="text-sm text-muted-foreground">
                  あなたの名前を変更します。
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Input
                  value={name}
                  placeholder="あなたの名前"
                  onChange={(e) => setName(e.target?.value)}
                />
                <Button onClick={handleChangeName}>変更</Button>
              </div>
            </div>
            <Separator className="mx-3 w-[96%]" />
            <div className="flex p-4 items-center gap-2">
              <div>
                <h3 className="text-lg font-bold">プライバシーモード</h3>
                <p className="text-sm text-muted-foreground">
                  あなたの名前、メールアドレス、プロフィール画像を非表示にします。
                </p>
              </div>
              <div className="ml-auto">
                <Switch
                  checked={privacyMode}
                  onCheckedChange={togglePrivacyMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
