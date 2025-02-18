import React, { useEffect, useState } from "react";
import {
  UserDataInterface,
  MessageDataInterface,
  UserSettingsInterface,
} from "@firebase/types";
import { toast } from "sonner";
import { User } from "firebase/auth";
import {
  isCheckmarker,
  isHighlightAvailable,
  xssProtectedText,
} from "@firebase/tools";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@repo/ui/components/avatar";
import {
  Ban,
  Check,
  Gavel,
  HeartIcon,
  MenuSquare,
  Reply,
  Share,
  Shield,
  Trash2,
  UserIcon,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { firestore, db } from "@firebase/config";
import { get, ref, set } from "firebase/database";
import Link from "next/link";
import Image from "next/image";
// New imports for DropdownMenu and AlertDialog
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@repo/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Separator } from "@repo/ui/components/separator";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

interface MessageElementProps {
  userData: UserDataInterface;
  messageData: MessageDataInterface;
  user: User;
  userSettings: UserSettingsInterface;
  isStaff: boolean;
}

type ActionType = "ban" | "forceRemove" | "remove" | null;

const MessageElement: React.FC<MessageElementProps> = ({
  userData,
  messageData,
  user,
  userSettings,
  isStaff,
}) => {
  const [favoriteCount, setFavoriteCount] = useState(messageData.favorite || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const [isFavoriting, setIsFavoriting] = useState(false);

  const [shouldShowImageDialog, setShouldShowImageDialog] = useState(false);

  // New state for AlertDialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  const messageId = messageData.id || "undefined";
  const userId = messageData.uid || "undefined";

  useEffect(() => {
    const checkInitialFavoriteStatus = async () => {
      const favoriteDoc = doc(
        firestore,
        "raichat-message-status",
        messageId,
        user.uid,
        "data"
      );
      const favoriteSnapshot = await getDoc(favoriteDoc);

      setIsFavorited(favoriteSnapshot.exists());

      // Set up interval for favorite count updates
      const interval = setInterval(async () => {
        const messageDoc = await get(
          ref(db, `messages_new_20240630/${messageId}`)
        );
        if (messageDoc.exists()) {
          const messageData = messageDoc.val();
          if (messageData.favorite) {
            setFavoriteCount(messageData.favorite);
          }
        }
      }, 1000);

      // Initial favorite count check
      const messageDoc = await get(
        ref(db, `messages_new_20240630/${messageId}`)
      );
      if (messageDoc.exists()) {
        const messageData = messageDoc.val();
        if (messageData.favorite) {
          setFavoriteCount(messageData.favorite);
        }
      }

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    };

    checkInitialFavoriteStatus();
  }, [messageId, user.uid]);

  const processedMessage = React.useMemo(() => {
    const message = xssProtectedText(messageData.message);

    if (userSettings.markdown) {
      const markdownRules = [
        { pattern: /\[b\]/g, replacement: "<b>" },
        { pattern: /\[\/b\]/g, replacement: "</b>" },
        { pattern: /\[i\]/g, replacement: "<i>" },
        { pattern: /\[\/i\]/g, replacement: "</i>" },
        { pattern: /\[u\]/g, replacement: "<u>" },
        { pattern: /\[\/u\]/g, replacement: "</u>" },
        { pattern: /\[s\]/g, replacement: "<s>" },
        { pattern: /\[\/s\]/g, replacement: "</s>" },
        { pattern: /\[icon\]/g, replacement: "<Fa" },
        { pattern: /\[\/icon\]/g, replacement: " />" },
        { pattern: /\[url\]/g, replacement: '<a class="text-blue-500" href="' },
        { pattern: /\[\/url\]/g, replacement: '">URL</a>' },
        { pattern: /\[img\]/g, replacement: '<br><img src="' },
        {
          pattern: /\[\/img\]/g,
          replacement:
            '" onclick="window.open(this.src)" class="mt-2 rounded-md border-2" width=250>',
        },
        { pattern: /\[video\]/g, replacement: '<br><video src="' },
        {
          pattern: /\[\/video\]/g,
          replacement: '" onload="this.width=250;this.onload=null;" controls>',
        },
      ];

      return markdownRules.reduce(
        (acc, rule) => acc.replace(rule.pattern, rule.replacement),
        message
      );
    }

    return message;
  }, [messageData.message, userSettings.markdown]);

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isFavoriting) {
      toast.error("お気に入りできませんでした", {
        description: "このメッセージへのお気に入り追加・削除は現在進行中です。",
      });
      return;
    }
    setIsFavoriting(true);
    const favMessageId = messageData.id.toString();

    const favoriteDoc = doc(
      firestore,
      "raichat-message-status",
      favMessageId,
      user.uid,
      "data"
    );
    const favoriteSnapshot = await getDoc(favoriteDoc);

    if (favoriteSnapshot.exists()) {
      // Remove favorite
      await deleteDoc(favoriteDoc);
      const newCount = favoriteCount - 1;
      await set(ref(db, `messages_new_20240630/${favMessageId}`), {
        ...messageData,
        favorite: newCount,
      });
      toast.success("お気に入りを解除しました", {
        description: "このメッセージのお気に入りを解除しました",
      });
      setFavoriteCount(newCount);
      setIsFavorited(false);
      setIsFavoriting(false);
    } else {
      // Add favorite
      await setDoc(favoriteDoc, { isFavorited: true });
      const newCount = favoriteCount + 1;
      await set(ref(db, `messages_new_20240630/${favMessageId}`), {
        ...messageData,
        favorite: newCount,
      });
      toast.success("お気に入りに追加しました", {
        description: "このメッセージをお気に入りへ追加しました",
      });
      setFavoriteCount(newCount);
      setIsFavorited(true);
      setIsFavoriting(false);
    }
  };

  const handleBAN = async () => {
    if (!isStaff) return;
    const userDoc = doc(firestore, "raichat-user-status", messageData.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userDataDoc = userSnapshot.data() as UserDataInterface;
      await setDoc(userDoc, {
        ...userDataDoc,
        banned: true,
        banReason: banReason,
      });
    }
  };

  const handleForceRemove = async () => {
    if (!isStaff) return;
    await set(ref(db, `messages_new_20240630/${messageId}`), null);
    setIsDeleted(true);
  };

  const handleRemove = async () => {
    if (messageData.uid === user.uid) {
      await set(ref(db, `messages_new_20240630/${messageId}`), null);
      setIsDeleted(true);
    }
  };

  const handleConfirmAction = async () => {
    if (selectedAction === "ban") {
      await handleBAN();
    } else if (selectedAction === "forceRemove") {
      await handleForceRemove();
    } else if (selectedAction === "remove") {
      await handleRemove();
    }
    // Reset the state
    setSelectedAction(null);
    setDialogOpen(false);
  };

  if (isDeleted) {
    return null;
  }

  if (userData.banned) {
    return (
      <div className="bg-red-800 rounded-lg p-2 px-6 text-white">
        <span>
          Rai Chat System <Shield className="system color-red inline" />{" "}
          {messageData.time}:
          アクセスが禁止されているアカウントからのメッセージです。
          <a
            href="/chat/docs/tos.html"
            target="_blank"
            className="text-blue-400"
          >
            利用規約。
          </a>
        </span>
      </div>
    );
  }

  return (
    <>
      <Card
        data-messageid={messageId}
        id={messageId}
        data-userid={userId}
        className={cn(
          "inline-block rounded-lg p-2 px-3 md:px-6 w-full",
          isHighlightAvailable(userData) && "border-amber-300"
        )}
      >
        <CardHeader className="flex gap-4 p-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={userData.image || "/images/chat-defaultProfile.png"}
              alt="user"
            />
            <AvatarFallback>
              <Image
                alt="Default"
                src="/images/chat-defaultProfile.png"
                width={128}
                height={128}
              />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium flex items-center gap-1">
              <Link
                href={`/profile/${userData.uid}`}
                className="hover:underline"
              >
                {userData.username}{" "}
              </Link>
              {isCheckmarker(userData) && (
                <>
                  {userData.isStaff ? (
                    <Gavel className="text-yellow-400 cursor-pointer" />
                  ) : userData.isGov ? (
                    <Check className="text-neutral-400 cursor-pointer" />
                  ) : userData.isStudent ? (
                    <UserIcon className="text-green-400 cursor-pointer" />
                  ) : (
                    <Check className="text-blue-400 cursor-pointer" />
                  )}
                </>
              )}
              <div className="ml-2 text-sm text-muted-foreground">
                @{userData.handle} ({messageData.time})
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pl-4">
          {messageData.isSystemMessage && (
            <Shield className="text-red-500 dark:text-red-400 inline mr-1" />
          )}
          <span dangerouslySetInnerHTML={{ __html: processedMessage }} />

          {messageData.image && (
            <div className="mt-2">
              <Image
                src={messageData.image}
                onClick={() => setShouldShowImageDialog(true)}
                alt="Message Image"
                width={400}
                height={400}
                className="rounded-lg"
              />
            </div>
          )}
        </CardContent>

        <Separator />

        <CardFooter className="flex items-center justify-between p-4 border-muted">
          <Button
            className="flex items-center gap-2"
            variant={"secondary"}
            onClick={handleFavorite}
          >
            <Link
              className="flex items-center gap-2"
              href={`/message/${messageData.id}`}
            >
              <Reply />
              返信
            </Link>
          </Button>

          <Button
            className="flex items-center gap-2"
            variant={"secondary"}
            disabled={isFavoriting}
            onClick={handleFavorite}
          >
            <HeartIcon
              {...(isFavorited && { fill: "#FF0000", stroke: "#FF0000" })}
            />
            <span>{favoriteCount}</span>
          </Button>

          <Button
            className="flex items-center gap-2"
            variant={"secondary"}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/message/${messageData.id}`
              );

              toast.success("リンクをコピーしました", {
                description:
                  "このメッセージへのリックをコピーしました。Rai Chat ユーザーなら共有できます。",
              });
            }}
          >
            <Share />
            共有
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"secondary"} className="flex items-center gap-2">
                <MenuSquare />
                その他
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>アクション</DropdownMenuLabel>
              {messageData.uid === user.uid && (
                <DropdownMenuItem
                  onSelect={() => {
                    setSelectedAction("remove");
                    setDialogOpen(true);
                  }}
                >
                  <Trash2 className="inline mr-2" /> 削除
                </DropdownMenuItem>
              )}
              {isStaff && (
                <DropdownMenuItem
                  className="text-yellow-500 dark:text-yellow-400"
                  onSelect={() => {
                    setSelectedAction("ban");
                    setDialogOpen(true);
                  }}
                >
                  <Ban className="inline mr-2" /> BAN
                </DropdownMenuItem>
              )}
              {isStaff && (
                <DropdownMenuItem
                  className="text-yellow-500 dark:text-yellow-400"
                  onSelect={() => {
                    setSelectedAction("forceRemove");
                    setDialogOpen(true);
                  }}
                >
                  <Trash2 className="inline mr-2" /> 強制削除
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <AlertDialog
        open={shouldShowImageDialog}
        onOpenChange={setShouldShowImageDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>画像</AlertDialogTitle>
          </AlertDialogHeader>
          <Image
            src={messageData.image || ""}
            alt="Message Image"
            width={750}
            height={750}
            unoptimized={true}
            className="w-full h-auto"
          />
          <Link
            className="text-blue-500 dark:text-blue-400 hover:underline w-fit"
            target="_blank"
            href={messageData.image || ""}
          >
            画像を開く
          </Link>
          <AlertDialogFooter>
            <AlertDialogCancel>閉じる</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/** Alert Dialog to confirm actions */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedAction === "ban"
                ? "ユーザーをBANしますか？"
                : selectedAction === "forceRemove"
                  ? "メッセージを強制削除しますか？"
                  : selectedAction === "remove"
                    ? "メッセージを削除しますか？"
                    : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction === "ban" ? (
                <>
                  このユーザーをBANした場合、チャットの利用ができなくなります。本当にBANしますか？
                </>
              ) : selectedAction === "forceRemove" ? (
                <>
                  このメッセージを強制削除すると取り消しできません。本当に削除しますか？
                </>
              ) : selectedAction === "remove" ? (
                <>
                  このメッセージを削除すると永久に取り消しできません。本当に削除しますか？
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            {selectedAction === "ban" ? (
              <Input
                placeholder="BANする理由を入力してください。"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            ) : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {selectedAction === "ban"
                ? "BANする"
                : selectedAction === "forceRemove"
                  ? "強制削除する"
                  : selectedAction === "remove"
                    ? "削除する"
                    : "実行"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default React.memo(MessageElement);
