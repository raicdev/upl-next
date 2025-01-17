"use client";

import React, { useRef, useState } from "react";
import { auth } from "@/util/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { Button } from "@shadcn/button";
import { Label } from "@shadcn/label";
import { Input } from "@shadcn/input";
import { Separator } from "@shadcn/separator";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";

const Register: React.FC = () => {
  const noticeRef = useRef<HTMLLabelElement | null>(null);
  const [accountEmail, setEmail] = useState("");
  const [accountPassword, setPassword] = useState("");

  auth.onAuthStateChanged((user) => {
    if (user) window.location.pathname = "/home";
  });

  const registerWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.pathname = "/account";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;
        if (noticeRef.current) {
          noticeRef.current.textContent =
            errorContent + " (エラーコード: " + errorCode + ")";
        }
      });
  };

  const registerWithMicrosoft = () => {
    const provider = new OAuthProvider("microsoft.com");
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.pathname = "/account";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;
        if (noticeRef.current) {
          noticeRef.current.textContent =
            errorContent + " (エラーコード: " + errorCode + ")";
        }
      });
  };

  const registerWithGitHub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.pathname = "/account";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;
        if (noticeRef.current) {
          noticeRef.current.textContent =
            errorContent + " (エラーコード: " + errorCode + ")";
        }
      });
  };

  const registerClicked = async () => {
    if (!noticeRef.current) return;
    const notice = noticeRef.current;
    
    createUserWithEmailAndPassword(auth, accountEmail, accountPassword)
      .then(() => {
        window.location.pathname = "/account";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorContent = error.message;

        if (errorCode === "auth/email-already-in-use") {
          notice.textContent = "このメールアドレスは既に使用されています";
        } else if (errorCode === "auth/invalid-email") {
          notice.textContent = "メールアドレスの形式が正しくありません";
        } else if (errorCode === "auth/weak-password") {
          notice.textContent = "パスワードが弱すぎます";
        } else {
          notice.textContent = `エラーが発生しました: ${errorContent}`;
        }
      });
  };

  return (
    <div className="h-screen w-full">
      <div className="md:hidden"></div>
      <div className="container w-full h-screen m-auto lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Button
          variant={"ghost"}
          asChild
          className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
        >
          <Link href="/login">ログイン</Link>
        </Button>
        <div className="m-auto h-screen flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              アカウント作成
            </h1>
            <p className="text-sm text-muted-foreground">
              新しいアカウントを作成して、Rai Chat を始めましょう。
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="email">
              メールアドレス
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground" htmlFor="password">
              パスワード
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="パスワード"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Label ref={noticeRef} className="text-red-500"></Label>
          <Button type="submit" className="w-full" onClick={registerClicked}>
            登録
          </Button>
          <Separator />
          <div className="flex gap-x-2">
            <Button
              type="submit"
              className="w-full"
              onClick={() => registerWithGoogle()}
            >
              <SiGoogle />
            </Button>
            <Button
              type="submit"
              className="w-full"
              onClick={() => registerWithMicrosoft()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
                <path d="M1 1h10v10H1z" />
                <path d="M12 1h10v10H12z" />
                <path d="M1 12h10v10H1z" />
                <path d="M12 12h10v10H12z" />
              </svg>
            </Button>
            <Button
              type="submit"
              className="w-full"
              onClick={() => registerWithGitHub()}
            >
              <SiGithub />
            </Button>
          </div>
          <p className="px-2 text-center text-sm text-muted-foreground">
            アカウントを作成すると、{" "}
            <Link
              href="/infomation/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              利用規約
            </Link>{" "}
            と{" "}
            <Link
              href="/infomation/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              プライバシーポリシー
            </Link>{" "}
            に同意したことになります。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;