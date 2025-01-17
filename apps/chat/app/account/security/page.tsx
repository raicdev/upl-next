/* eslint @typescript-eslint/no-explicit-any: off */
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { auth } from "@firebase/config";
import {
  EmailAuthProvider,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
  multiFactor,
  TotpSecret,
} from "firebase/auth";
import qrcode from "qrcode";
import { Loading } from "@shadcn/loading";
import { SidebarProvider } from "@shadcn/sidebar";
import { Button } from "@shadcn/button";
import { Input } from "@shadcn/input";
import { AlertDialogHeader, AlertDialogFooter } from "@shadcn/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@shadcn/input-otp";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@shadcn/alert-dialog";
import { Label } from "@shadcn/label";
import { cn } from "@workspace/ui/lib/utils";

const Login: React.FC = () => {
  const welcomeRef = useRef<HTMLHeadingElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLHeadingElement | null>(null);
  const qrCodeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tfaActivateRef = useRef<HTMLButtonElement | null>(null);
  const dialogPromiseRef = useRef<{ resolve: (value: string) => void } | null>(
    null
  );

  const [totpSecret, setTotpSecret] = useState({} as TotpSecret);

  const [twoFaCode, setTwoFaCode] = useState("");
  const [isPasswordAuth, setPasswordAuth] = useState(true);
  const [notice, setNotice] = useState("");
  const [noticeTFA, setNoticeTFA] = useState("");

  const [dialogDescription, setDialogDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegisterTFADialogOpen, setRegisterTFADialogOpen] = useState(false);
  const [isTFAEnabled, setTFAEnabled] = useState(false);
  const [RegisterTFAPhase, setRegisterTFAPhase] = useState(0);
  const [UnregisterTFAPhase, setUnregisterTFAPhase] = useState(0);
  const [isUnregisterTFADialogOpen, setUnregisterTFADialogOpen] =
    useState(false);
  const [accountPassword, setPassword] = useState("");
  const [accountPasswordTFA, setAccountPasswordTFA] = useState("");
  const [accountNewPassword, setNewPassword] = useState("");

  const tfaPhaseMessage = [
    {
      title: "まず、パスワードを確認してください。",
      description:
        "アカウントのセキュリティを保護するため、パスワードを入力してください。",
    },
    {
      title: "認証アプリを設定してください。",
      description:
        "二段階認証を有効にするには、アプリに登録してコードを確認する必要があります。",
    },
    {
      title: "二段階認証を有効にしました。",
      description: "おめでとうございます！二段階認証が有効になりました！",
    },
  ];

  const unTFAPhaseMessage = [
    {
      title: "パスワードと認証コードを入力してください。",
      description:
        "アカウントのセキュリティを保護するため、パスワードと認証コードを入力してください。",
    },
    {
      title: "二段階認証を無効にしました。",
      description: "二段階認証が無効になりました。この行為は推奨されません。",
    },
  ];

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.pathname = "/account/login";
        return;
      }
      if (auth.currentUser?.providerData[0]?.providerId == "password") {
        setPasswordAuth(true);
      } else {
        setPasswordAuth(false);
        setNotice("パスワード認証ではないため、利用できません。");
        setNoticeTFA("パスワード認証ではないため、利用できません。");
      }
      if (multiFactor(user).enrolledFactors.length > 0) {
        multiFactor(user).enrolledFactors.forEach((mf) => {
          console.log(mf);
        });
        setTFAEnabled(true);
      }
      loadingRef.current?.classList.add("hidden");
      mainRef.current?.classList.remove("hidden");
      mainRef.current?.classList.add("flex");
      if (welcomeRef.current) {
        welcomeRef.current.textContent = auth.currentUser?.displayName
          ? `${auth.currentUser?.displayName} さん、こんにちは！`
          : "名無しさん、こんにちは！";
      }
    });
  }, []);

  const passwordChangeClicked = async () => {
    if (!accountPassword && !accountNewPassword) {
      setNotice("すべてのフィールドを入力してください");
      return;
    }
    reauthenticateWithCredential(
      auth.currentUser!,
      EmailAuthProvider.credential(
        auth.currentUser?.email || "",
        accountPassword
      )
    )
      .then(() => {
        updatePassword(auth.currentUser!, accountNewPassword)
          .then(() => {
            setNotice("パスワードが変更されました");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/invalid-password") {
              setNotice("パスワードが無効です。もう一度お試しください。");
            } else if (errorCode === "auth/weak-password") {
              setNotice("パスワードは6文字以上である必要があります");
            } else {
              setNotice("エラーが発生しました: ") + errorMessage;
            }
          });
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (
          errorCode == "auth/invalid-password" ||
          errorCode == "auth/invalid-credential"
        ) {
          setNotice("パスワードが間違っています");
        } else if (errorCode == "auth/multi-factor-auth-required") {
          const mfaResolver = getMultiFactorResolver(auth, error);

          const resolver = getMultiFactorResolver(auth, error);
          // Ask user which second factor to use.
          if (
            resolver.hints[0]?.factorId === TotpMultiFactorGenerator.FACTOR_ID
          ) {
            const tfaCode = await request2FaCode(
              "パスワードを変更するには、アプリの認証コードを入力してください。"
            );
            if (!tfaCode) return;
            const multiFactorAssertion =
              TotpMultiFactorGenerator.assertionForSignIn(
                mfaResolver.hints[0]?.uid || "",
                tfaCode
              );
            try {
              setTwoFaCode("");
              await mfaResolver.resolveSignIn(multiFactorAssertion).then(() => {
                updatePassword(auth.currentUser!, accountNewPassword);
                setNotice("パスワードが変更されました");
              });
            } catch (e) {
              console.log(e);
              setNotice("無効な認証コードです。もう一度お試しください。");
            }
          }
        } else if (errorCode == "auth/too-many-requests") {
          setNotice(
            "短時間にリクエストを送信しすぎています。しばらく待ってからお試しください"
          );
        } else {
          setNotice(`その他のエラー: ${errorContent}`);
        }
      });
  };

  const UnregisterTFA = async () => {
    if (!accountPasswordTFA) {
      setNoticeTFA("パスワードを入力してください");
      return;
    }

    if (!twoFaCode) {
      setNoticeTFA("認証コードを入力してください");
      return;
    }

    try {
      await reauthenticateWithCredential(
        auth.currentUser!,
        EmailAuthProvider.credential(
          auth.currentUser!.email || "",
          accountPasswordTFA
        )
      );
    } catch (error: any) {
      if (error.code === "auth/multi-factor-auth-required") {
        // ここで多要素認証を要求する処理を追加
        const mfaResolver = getMultiFactorResolver(auth, error);
        const primaryEnrolledFactor = multiFactor(auth.currentUser!).enrolledFactors[0];
        if (primaryEnrolledFactor) {
          if (
            primaryEnrolledFactor.factorId ===
            TotpMultiFactorGenerator.FACTOR_ID
          ) {
            const multiFactorAssertion =
              TotpMultiFactorGenerator.assertionForSignIn(
                primaryEnrolledFactor.uid || "",
                twoFaCode
              );
            try {
              await mfaResolver.resolveSignIn(multiFactorAssertion);
              await multiFactor(auth.currentUser!)
                .unenroll(primaryEnrolledFactor.uid)
                .then(() => {
                  setUnregisterTFAPhase(1);
                  setTFAEnabled(false);
                });
            } catch (e) {
              console.log(e);
              setNoticeTFA("無効な認証コードです。もう一度お試しください。");
            }
          }
        } else {
          setNoticeTFA(
            "申し訳ございませんが、二段階認証の登録が見つかりませんでした。これがバグだと思う場合、お問い合わせをするかもう一度お試しください。"
          );
          return;
        }
      } else {
        setNoticeTFA("エラーが発生しました: ") + error.message;
      }
    }
  };

  const registerTFAPhase0 = async () => {
    if (!accountPasswordTFA) {
      setNoticeTFA("パスワードを入力してください");
      return;
    }

    reauthenticateWithCredential(
      auth.currentUser!,
      EmailAuthProvider.credential(
        auth.currentUser?.email || "",
        accountPasswordTFA
      )
    )
      .then(async (credential) => {
        const multiFactorSession = await multiFactor(
          credential.user
        ).getSession();
        const tfaSecret =
          await TotpMultiFactorGenerator.generateSecret(multiFactorSession);

        console.log("aaaa2");
        setRegisterTFAPhase(1);

        if (qrCodeCanvasRef.current) {
          setTotpSecret(tfaSecret);

          const qrCode = new URL(
            `otpauth://totp/UpLauncher?secret=${tfaSecret.secretKey}&issuer=UpLauncher`
          );

          console.log("aaaa");

          qrcode.toCanvas(
            qrCodeCanvasRef.current,
            qrCode.toString(),
            (error) => {
              if (error) {
                console.error(error);
              }
            }
          );
        }
      })
      .catch(async (error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (
          errorCode == "auth/invalid-password" ||
          errorCode == "auth/invalid-credential"
        ) {
          setNoticeTFA("パスワードが間違っています");
        } else if (errorCode == "auth/too-many-requests") {
          setNoticeTFA(
            "短時間にリクエストを送信しすぎています。しばらく待ってからお試しください"
          );
        } else {
          setNoticeTFA(`その他のエラー: ${errorContent}`);
        }
      });
  };

  const registerTFAPhase1 = async () => {
    if (!twoFaCode) {
      setNoticeTFA("認証コードを入力してください");
      return;
    }

    const multiFactorAssertion =
      TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, twoFaCode);
    await multiFactor(auth.currentUser!)
      .enroll(multiFactorAssertion, "TOTP")
      .then(() => {
        setRegisterTFAPhase(2);
        setTFAEnabled(true);
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode == "auth/invalid-verification-code") {
          setNoticeTFA("コードが間違っています");
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
          <div
            ref={mainRef}
            className="min-h-screen w-full flex flex-col p-4 lg:flex-row"
          >
            {/* Main Content */}
            <div className="flex-grow w-full h-full lg:h-screen bg-grey-8 ml-0 lg:ml-4">
              <h1 className="text-3xl lg:text-6xl font-bold mb-4">
                セキュリティ
              </h1>
              <p className="text-lg lg:text-xl mb-8 max-w-5xl">
                ここでは、パスワードや二段階認証の設定を変更できます。
              </p>

              {/* Flex Row for Email and Password Section */}
              {/* Password Section */}
              <div>
                <h2 className="text-3xl font-bold mb-4">パスワードを変更</h2>
                <p className="mb-3">
                  二段階認証が有効になっている場合は、認証コードを要求されます。
                </p>
                <Input
                  type="password"
                  placeholder="現在のパスワード"
                  onChange={(e) => setPassword(e.target.value)}
                  value={accountPassword}
                  className="mb-3 lg:w-1/2"
                />
                <Input
                  type="password"
                  placeholder="新しいパスワード"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={accountNewPassword}
                  className="mb-3 lg:w-1/2"
                />
                <p className="text-base mb-4 text-red-500">{notice}</p>
                <Button
                  type="button"
                  className="mb-5"
                  disabled={!isPasswordAuth}
                  onClick={passwordChangeClicked}
                >
                  変更する
                </Button>
              </div>

              {/* Two-Factor Authentication Section */}
              <div className="lg:w-full mt-8">
                <h2 className="text-3xl font-bold mb-4">
                  {isTFAEnabled
                    ? "二段階認証を無効にする"
                    : "二段階認証を有効にする"}
                </h2>
                <p className={cn("mb-3", !isPasswordAuth && "text-red-500")}>
                  {isPasswordAuth ? (
                    isTFAEnabled ? (
                      <>
                        二段階認証を無効にする行為は、非常に推奨されていません。
                        <br />
                        あなたのアカウントを復旧したい場合は、お問い合わせからご連絡ください。
                      </>
                    ) : (
                      "二段階認証を有効にすると、アカウントのセキュリティが向上します。"
                    )
                  ) : (
                    "パスワード認証ではないため、二段階認証を有効にすることができません。"
                  )}
                </p>
                <Button
                  type="button"
                  className="mb-5"
                  disabled={!isPasswordAuth}
                  ref={tfaActivateRef}
                  onClick={() =>
                    isTFAEnabled
                      ? setUnregisterTFADialogOpen(true)
                      : setRegisterTFADialogOpen(true)
                  }
                >
                  続ける
                </Button>
              </div>
            </div>
          </div>

          <AlertDialog open={isRegisterTFADialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {tfaPhaseMessage[RegisterTFAPhase]?.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {tfaPhaseMessage[RegisterTFAPhase]?.description}
                </AlertDialogDescription>
              </AlertDialogHeader>

              {RegisterTFAPhase === 0 && (
                <Input
                  type="password"
                  placeholder="パスワード"
                  onChange={(e) => setAccountPasswordTFA(e.target.value)}
                  value={accountPasswordTFA}
                  className="mb-3"
                />
              )}
              <div
                className={
                  RegisterTFAPhase === 1
                    ? "flex flex-col items-center"
                    : "hidden"
                }
              >
                <canvas ref={qrCodeCanvasRef}></canvas>
                <p className="text-base mb-2">{totpSecret.secretKey}</p>
                <InputOTP
                  maxLength={6}
                  value={twoFaCode}
                  onChange={(e) => setTwoFaCode(e)}
                  required
                  placeholder="123456"
                >
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
              </div>

              <p className="mb-3 text-red-500">{noticeTFA}</p>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setRegisterTFADialogOpen(false)}
                >
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    RegisterTFAPhase == 0
                      ? registerTFAPhase0()
                      : RegisterTFAPhase == 2
                        ? setRegisterTFADialogOpen(false)
                        : registerTFAPhase1()
                  }
                >
                  続行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isUnregisterTFADialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {unTFAPhaseMessage[UnregisterTFAPhase]?.title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {unTFAPhaseMessage[UnregisterTFAPhase]?.description}
                </AlertDialogDescription>
              </AlertDialogHeader>

              {UnregisterTFAPhase === 0 && (
                <div>
                  <Label className="text-muted-foreground" htmlFor="password">
                    パスワード
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="パスワード"
                    onChange={(e) => setAccountPasswordTFA(e.target.value)}
                    value={accountPasswordTFA}
                    className="mb-3"
                  />
                  <Label className="text-muted-foreground" htmlFor="twoFaCode">
                    二段階認証のコード
                  </Label>
                  <InputOTP
                    id="twoFaCode"
                    maxLength={6}
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e)}
                    required
                    placeholder="123456"
                  >
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
                </div>
              )}
              <p className="mb-3 text-red-500">{noticeTFA}</p>

              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setUnregisterTFADialogOpen(false)}
                >
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    UnregisterTFAPhase == 0
                      ? UnregisterTFA()
                      : setUnregisterTFADialogOpen(false)
                  }
                >
                  続行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>二段階認証が必要です</AlertDialogTitle>
                <AlertDialogDescription>
                  {dialogDescription
                    ? dialogDescription
                    : "このアカウントは、2段階認証による追加の保護が付与されています。"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Label className="text-muted-foreground" htmlFor="twoFaCode">
                二段階認証のコード
              </Label>
              <InputOTP
                maxLength={6}
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e)}
                required
                placeholder="123456"
              >
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
                <AlertDialogCancel onClick={closeDialog}>
                  キャンセル
                </AlertDialogCancel>
                <AlertDialogAction onClick={closeDialog}>
                  続行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};

export default Login;
