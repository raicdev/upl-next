"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Loading } from "@repo/ui/components/loading";
import { auth, firestore } from "@firebase/config";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { SidebarProvider } from "@repo/ui/components/sidebar";
import { Button } from "@repo/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { Eye, Trash } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { toast } from "sonner";
// react router

const Credentials: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);
  const [visibleKeyIndex, setVisibleKeyIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchApiKeys(user);
      } else {
        location.href = "/account/login";
      }
    });

    return () => unsubscribe();
  }, []);

  const openDialog = async () => {
    auth.currentUser
      ?.getIdToken(true)
      .then((FB_AuthToken) => {
        setAuthToken(FB_AuthToken);
        setIsDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching auth token:", error);
      });
  };

  const fetchApiKeys = async (user: User) => {
    const apiKeysCollection = collection(firestore, "rai-api-key");
    const docRef = doc(apiKeysCollection, user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setApiKeys(docSnap.data().apiKeys || []);
    }
    setLoading(false);
  };

  const createApiKey = async () => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      try {
        const response = await fetch("https://api.raic.dev/v1/key/create", {
          method: "POST",
          headers: {
            Authorization: idToken,
          },
        });
        const data = await response.json();
        if (data.apiKey) {
          const docRef = doc(firestore, "rai-api-key", user.uid);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(docRef, { apiKeys: [] });
          }
          await updateDoc(docRef, {
            apiKeys: arrayUnion(data.apiKey),
          });
          setApiKeys((prevKeys) => [...prevKeys, data.apiKey]);
          toast.success("成功しました", {
            description:
              "API キーの作成に成功しました！API キーをコピーして利用しましょう！",
          });
        } else {
          toast.error("失敗しました", {
            description:
              "API キーの作成に失敗しました。もう一度お試しください。",
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error("失敗しました", {
          description: `API キーの作成に失敗しました。もう一度お試しください。(${errorMessage})`,
        });
      }
    }
  };

  const deleteApiKey = async (key: string) => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      const response = await fetch("https://api.raic.dev/v1/key/delete", {
        method: "POST",
        headers: {
          Authorization: idToken,
          "X-ApiKey": key,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        const docRef = doc(firestore, "rai-api-key", user.uid);
        await updateDoc(docRef, {
          apiKeys: arrayRemove(key),
        });
        setApiKeys((prevKeys) => prevKeys.filter((k) => k !== key));
        toast.success("成功しました", {
          description: "API キーを削除しました。",
        });
      } else {
        toast.error("失敗しました", {
          description: "API キーの削除に失敗しました。もう一度お試しください。",
        });
      }
    }
  };

  return (
    <SidebarProvider className="mt-8">
      <div className="min-h-screen w-full flex p-4 flex-col lg:flex-row">
        <Suspense fallback={<Loading />}>
          <div className="flex-grow w-full h-full lg:h-screen ml-0 lg:ml-4">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              API キーの管理
            </h1>
            <p className="text-lg lg:text-xl mb-8 max-w-5xl">
              API から使用できるキーの管理
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mb-5">
              API キーを作成する
            </h2>

            <Button onClick={createApiKey} className="mb-4 md:mb-0 mr-2">
              API キーを作成
            </Button>

            <Button variant={"destructive"} onClick={openDialog}>
              Firebase の Auth Token を発行
            </Button>

            <div className="mt-8">
              {loading ? (
                <Loading />
              ) : (
                apiKeys.map((key, index) => (
                  <div
                    key={index}
                    className="p-2 md:p-4 rounded bg-sidebar-accent flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-2"
                  >
                    <span className="text-sm md:text-base">
                      API キー {index + 1}
                    </span>
                    <div className="flex items-center w-full md:w-auto">
                      <Input
                        onClick={(e) => {
                          (e.target as HTMLInputElement).select();
                          navigator.clipboard.writeText(key);
                          toast.success("コピーしました");
                        }}
                        className={cn(
                          "mr-2 md:mr-4 transition-opacity duration-200 text-sm md:text-base break-all",
                          visibleKeyIndex != index ? "opacity-0" : "opacity-100"
                        )}
                      >
                        {key}
                      </Input>
                      <Button
                        size="icon"
                        onClick={() =>
                          setVisibleKeyIndex(
                            visibleKeyIndex === index ? null : index
                          )
                        }
                        className="mr-2 md:mr-4"
                        title="API キーを表示"
                      >
                        <Eye className="h-4 w-4 md:h-6 md:w-6" />
                      </Button>
                      <Button
                        size="icon"
                        variant={"destructive"}
                        onClick={() => deleteApiKey(key)}
                        title="API キーを削除"
                      >
                        <Trash className="h-4 w-4 md:h-6 md:w-6" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <AlertDialog open={isDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Firebase の認証トークンを発行しました
                </AlertDialogTitle>
                <AlertDialogDescription>
                  これらのトークンは、アカウントが盗まれる可能性があるため他人には公開しないでください。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Label className="text-muted-foreground" htmlFor="authToken">
                認証トークン
              </Label>

              <Input
                type="text"
                id="authToken"
                value={authToken}
                readOnly
                onClick={(e) => {
                  (e.target as HTMLInputElement).select();
                  navigator.clipboard.writeText(authToken!);

                  toast.success("コピーしました");
                }}
              />

              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
                  閉じる
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Suspense>
      </div>
    </SidebarProvider>
  );
};

export default Credentials;
