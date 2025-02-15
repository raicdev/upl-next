"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@workspace/ui/components/button";
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert";
import { Loading } from "@workspace/ui/components/loading";
import { ArrowDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import React, { lazy, Suspense, useEffect } from "react";

const Products = lazy(() => import("@/components/Products"));
const Socials = lazy(() => import("@/components/Socials"));
const Contact = lazy(() => import("@/components/Contact"));

const App: React.FC = () => {
  useEffect(() => {
    const newTabLinks = document.querySelectorAll(".newtab");
    newTabLinks.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, []);

  const scrollClick = () => {
    window.scrollTo({ top: 1000, behavior: "smooth" });
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen flex flex-col items-center justify-between text-center">
        <main className="flex-grow flex h-screen flex-col items-center justify-center w-full">
          <h1 className="text-6xl font-bold mb-4 bold-h1">雷のサイト</h1>
          <p className="text-xl mb-8 max-w-xl">
            Rai ChatとかVistaUpdaterとかDiscordのbot作ったりゲームしてる人
            <br />
            <small>(Full Stack Developer)</small>
          </p>

          <div className="flex space-x-4">
            <Button className="pt-6 pb-6" size={"lg"} onClick={scrollClick}>
              スクロール <ArrowDown className="bounce ml-2" />
            </Button>
            <Button asChild className="p-4 pt-6 pb-6" size="lg" variant={"secondary"}>
              <Link href="https://github.com/raidesuuu">
                <SiGithub /> <span>GitHub</span>
              </Link>
            </Button>
          </div>
        </main>

        <Alert className="md:w-1/2 mx-auto">
          <AlertTitle>アカウント機能は、Rai Chat へ移行されました。</AlertTitle>
          <AlertDescription>
            アカウント機能は無料で、Rai Chat (chat.raic.dev)
            で利用することができます。ご理解のほどよろしくお願いいたします。
            <br />
            <Button asChild className="mt-2">
              <Link target="_blank" href="https://chat.raic.dev">
                <MessageCircle />
                Rai Chat
              </Link>
            </Button>
          </AlertDescription>
        </Alert>

        <Products />
        <Socials />
        <Contact />
      </div>
    </Suspense>
  );
};

export default App;
