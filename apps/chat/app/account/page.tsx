/* eslint @typescript-eslint/no-explicit-any: off */
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { auth } from "@firebase/config";
import { EmailAuthProvider, getMultiFactorResolver, TotpMultiFactorGenerator, reauthenticateWithCredential, verifyBeforeUpdateEmail, onAuthStateChanged, multiFactor } from "firebase/auth";
import { Loading } from "@workspace/ui/components/loading";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { AlertDialogHeader, AlertDialogFooter } from "@workspace/ui/components/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@workspace/ui/components/input-otp";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@workspace/ui/components/alert-dialog";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

const Login: React.FC = () => {
  const welcomeRef = useRef<HTMLHeadingElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLHeadingElement | null>(null);
  const noticeRef = useRef<HTMLParagraphElement | null>(null);
  const noticeTFARef = useRef<HTMLParagraphElement | null>(null);
  const dialogPromiseRef = useRef<{ resolve: (value: string) => void } | null>(null);

  const [isPasswordAuth, setPasswordAuth] = useState(true);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [dialogDescription, setDialogDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accountEmail, setEmail] = useState("");
  const [accountPassword, setPassword] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.pathname = "/account/login";
        return;
      }
      if (user.providerData[0]?.providerId === "password") {
        setPasswordAuth(true);
      } else {
        setPasswordAuth(false);
        if (noticeRef.current) {
          noticeRef.current.textContent = "パスワード認証ではないため、この機能は利用できません。";
        }
      }
      if (multiFactor(user).enrolledFactors.length > 0 && noticeTFARef.current) {
        multiFactor(user).enrolledFactors.forEach((mf) => {
          console.log(mf);
        });
        noticeTFARef.current.textContent = "二段階認証は有効になっています！";
      }
      if (loadingRef.current) {
        loadingRef.current.classList.add("hidden");
      }
      if (mainRef.current) {
        mainRef.current.classList.remove("hidden");
        mainRef.current.classList.add("flex");
      }
      if (welcomeRef.current) {
        welcomeRef.current.textContent = auth.currentUser?.displayName ? `${auth.currentUser.displayName} さん、こんにちは！` : "名無しさん、こんにちは！";
      }
    });
  }, []);

  const emailChangeClicked = async () => {
    if (!noticeRef.current) return;
    const notice = noticeRef.current;
    if (!accountPassword && !accountEmail) {
      notice.textContent = "すべてのフィールドを入力してください";
      return;
    }
    reauthenticateWithCredential(auth.currentUser!, EmailAuthProvider.credential(auth.currentUser?.email || "", accountPassword))
      .then(() => {
        verifyBeforeUpdateEmail(auth.currentUser!, accountEmail)
          .then(() => {
            notice.innerHTML = "メールアドレスの変更を完了するには、新しいメールアドレスを認証する必要があります。\n新しいメールアドレスのメールボックスを確認してください。";
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              notice.innerHTML = "このメールアドレスは既に使用されています。";
            } else if (error.code === "auth/invalid-email") {
              notice.innerHTML = "無効なメールアドレスです。";
            } else if (error.code === "auth/operation-not-allowed") {
              notice.innerHTML = "メールアドレスを変更するには、現在のメールアドレスを確認する必要があります。";
            }
          });
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (errorCode == "auth/invalid-password" || errorCode == "auth/invalid-credential") {
          notice.textContent = "メールアドレスかパスワードが間違っています";
        } else if (errorCode === "auth/email-already-in-use") {
          notice.textContent = "このメールアドレスは既に使用されています。";
        } else if (errorCode == "auth/multi-factor-auth-required") {
          const mfaResolver = getMultiFactorResolver(auth, error);

          const resolver = getMultiFactorResolver(auth, error);
          // Ask user which second factor to use.
          if (resolver.hints[0]?.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
            const tfaCode = await request2FaCode("メールアドレスを変更するには、アプリの認証コードを入力してください。");
            if (!tfaCode) return;
            const multiFactorAssertion = TotpMultiFactorGenerator.assertionForSignIn(mfaResolver.hints[0]?.uid || "" || "", tfaCode);
            try {
              await mfaResolver.resolveSignIn(multiFactorAssertion).then(() => {
                verifyBeforeUpdateEmail(auth.currentUser!, accountEmail)
                  .then(() => {
                    notice.innerHTML = "メールアドレスの変更を完了するには、新しいメールアドレスを認証する必要があります。\n新しいメールアドレスのメールボックスを確認してください。";
                  })
                  .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                      notice.innerHTML = "このメールアドレスは既に使用されています。";
                    } else if (error.code === "auth/invalid-email") {
                      notice.innerHTML = "無効なメールアドレスです。";
                    } else if (error.code === "auth/operation-not-allowed") {
                      notice.innerHTML = "メールアドレスを変更するには、現在のメールアドレスを確認する必要があります。";
                    }
                  });
              });
            } catch (e) {
              console.log(e);
              notice.textContent = "無効な認証コードです。もう一度お試しください。";
            }
          }
        } else if (errorCode == "auth/too-many-requests") {
          notice.textContent = "短時間にリクエストを送信しすぎています。しばらく待ってからお試しください";
        } else if (errorCode == "auth/invalid-email") {
          notice.textContent = "メールアドレスが無効です";
        } else {
          notice.textContent = `その他のエラー: ${errorContent}`;
        }
      });
  };

  const request2FaCode = (reason: string) => {
    return new Promise<string>((resolve) => {
      // ダイアログを開く
      setIsDialogOpen(true);
      setDialogDescription(reason);
      // ダイアログを閉じたときに resolve する
      dialogPromiseRef.current = { resolve };
    });
  };

  // ダイアログを閉じる処理
  const closeDialog = () => {
    setIsDialogOpen(false);
    if (dialogPromiseRef.current) {
      // ダイアログが閉じたら入力された2FAコードをresolveで返す
      dialogPromiseRef.current.resolve(twoFaCode);
      dialogPromiseRef.current = null;
    }
  };

  return (
    <SidebarProvider className="mt-8">
      <div className="min-h-screen">
        <Suspense fallback={<Loading />}>
          <div ref={mainRef} className="min-h-screen w-full flex lg:flex-row p-4">
            {/* Main Content */}
            <div className="flex-grow w-full h-full lg:h-screen bg-grey-8 ml-0 lg:ml-4">
              <h1 className="text-3xl lg:text-6xl font-bold mb-4">こんにちは！</h1>
              <p className="text-lg lg:text-xl mb-8 max-w-5xl">
                このパネルでは、メールアドレスやパスワードを管理したり、サブスクリプションの管理などができます。
                <br />
                <br />
                <Button variant={"destructive"} onClick={() => auth.signOut()}>
                  ログアウト
                </Button>
              </p>

              {/* Flex Row for Email and Password Section */}
              {/* Email Section */}
              <div className="w-auto">
                <h2 className="text-3xl font-bold mb-4">メールアドレスを変更</h2>
                <p className="mb-3">新しいメールアドレスは確認する必要があります。</p>
                <Input type="text" placeholder="新しいメールアドレス" onChange={(e) => setEmail(e.target.value)} value={accountEmail} className="mb-3 lg:w-1/2" />
                <Input type="password" placeholder="パスワード" onChange={(e) => setPassword(e.target.value)} value={accountPassword} className="mb-3 lg:w-1/2" />
                <p className={cn("text-base text-red-500", !noticeRef.current?.textContent && "none")} ref={noticeRef}></p>
                <Button type="button" className="mb-5" disabled={!isPasswordAuth} onClick={emailChangeClicked}>
                  変更する
                </Button>
              </div>
            </div>
          </div>

          <AlertDialog open={isDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>二段階認証が必要です</AlertDialogTitle>
                <AlertDialogDescription>{dialogDescription ? dialogDescription : "このアカウントは、2段階認証による追加の保護が付与されています。"}</AlertDialogDescription>
              </AlertDialogHeader>
              <Label className="text-muted-foreground" htmlFor="twoFaCode">
                二段階認証のコード
              </Label>
              <InputOTP maxLength={6} value={twoFaCode} onChange={(e) => setTwoFaCode(e)} required placeholder="123456">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>{" "}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={closeDialog}>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={closeDialog}>続行</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};

export default Login;
