import React, { useEffect, useState } from "react";
import { UserDataInterface, MessageDataInterface } from "@/util/raiChatTypes";
import { User } from "firebase/auth";
import { isCheckmarker, xssProtectedText } from "@/util/rai";
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/ui/components/card";
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  Ban,
  Check,
  Gavel,
  HeartIcon,
  Shield,
  Trash2,
  UserIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { firestore, database } from "@/util/firebaseConfig";
import { get, ref, set } from "firebase/database";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Separator } from "@workspace/ui/components/separator";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MessageElementProps {
  userData: UserDataInterface;
  messageData: MessageDataInterface;
  user: User;
  userSettings: any;
  isStaff: boolean;
}

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

  const messageId = messageData.id.toString() || "undefined";
  const userId = messageData.uid || "undefined";
  const isSent = user?.uid === messageData.uid;

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
          ref(database, `messages_new_20240630/${messageId}`)
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
        ref(database, `messages_new_20240630/${messageId}`)
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
          replacement: '" width=250>',
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

  const handleFavorite = async (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    const messageId = messageData.id.toString();

    const favoriteDoc = doc(
      firestore,
      "raichat-message-status",
      messageId,
      user.uid,
      "data"
    );
    const favoriteSnapshot = await getDoc(favoriteDoc);

    if (favoriteSnapshot.exists()) {
      // Remove favorite
      await deleteDoc(favoriteDoc);
      const newCount = favoriteCount - 1;
      await set(ref(database, `messages_new_20240630/${messageId}`), {
        ...messageData,
        favorite: newCount,
      });
      setFavoriteCount(newCount);
      setIsFavorited(false);
    } else {
      // Add favorite
      await setDoc(favoriteDoc, { isFavorited: true });
      const newCount = favoriteCount + 1;
      await set(ref(database, `messages_new_20240630/${messageId}`), {
        ...messageData,
        favorite: newCount,
      });
      setFavoriteCount(newCount);
      setIsFavorited(true);
    }
  };

  const handleBAN = async () => {
    if (!isStaff) return;
    const userDoc = doc(firestore, "raichat-user-status", messageData.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as UserDataInterface;
      await setDoc(userDoc, {
        ...userData,
        banned: true,
        banReason: banReason,
      });
    }
  };

  const handleForceRemove = async () => {
    if (!isStaff) return;

    await set(ref(database, `messages_new_20240630/${messageId}`), null);
  };

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
    <Card
      data-messageid={messageId}
      id={messageId}
      data-userid={userId}
      className={`isMessageDiv inline-block rounded-lg p-2 px-3 md:px-6 w-full
        ${isSent ? "sent" : "receive"}
        ${
          isCheckmarker(userData)
            ? userData.isStaff
              ? "admin"
              : userData.isStudent
                ? "student"
                : "verified"
            : "free"
        }
        ${
          userData.paid !== "free" && userData.highlightActive
            ? "highlighted"
            : "not_highlighted"
        }`}
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
            ></Image>
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="font-medium flex items-center gap-1">
            <Link href={`/profile/${userData.uid}`} className="hover:underline">
              {userData.username}{" "}
            </Link>

            {isCheckmarker(userData) && (
              <Popover>
                <PopoverTrigger asChild>
                  {userData.isStaff ? (
                    <Gavel className="admin text-yellow-400" />
                  ) : userData.isGov ? (
                    <Check className="gov text-neutral-400" />
                  ) : userData.isStudent ? (
                    <UserIcon className="student text-green-400" />
                  ) : (
                    <Check className="verified text-blue-400" />
                  )}
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex items-start gap-2">
                    {userData.isStaff ? (
                      <Gavel className="admin text-yellow-400 size-8" />
                    ) : userData.isGov ? (
                      <Check className="gov text-neutral-400 size-8" />
                    ) : userData.isStudent ? (
                      <UserIcon className="student text-green-400 size-8" />
                    ) : (
                      <Check className="verified text-blue-400 size-8" />
                    )}
                    {userData.isStaff
                      ? "このアカウントは、Rai Chat のスタッフのアカウントであるため認証されています。"
                      : userData.isGov
                        ? "このアカウントは、政府または多国間機関のアカウントであるため認証されています。"
                        : userData.isStudent
                          ? "このアカウントは、学生特典が有効なアカウントであるため認証されています。"
                          : "このアカウントは、プレミアムを購入しているアカウントであるため認証されています。"}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <div className="ml-2 text-sm text-muted-foreground">
              @{userData.handle} ({messageData.time})
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pl-4">
        <Button variant={"secondary"} asChild>
          <Link href={`/message/${messageData.id}`}> メッセージへ飛ぶ</Link>
        </Button>
        <br /> <br />
        {messageData.isSystemMessage && (
          <Shield className="system color-red inline mr-1" />
        )}
        <span dangerouslySetInnerHTML={{ __html: processedMessage }} />
      </CardContent>

      <Separator />
      <CardFooter className="flex items-center justify-between p-4 border-muted">
        <div className="flex items-center gap-2 text-muted-foreground">
          <HeartIcon
            onClick={handleFavorite}
            className={`favorite`}
            {...(isFavorited && { fill: "#FF0000", stroke: "#FF0000" })}
          />
          <span>{favoriteCount} いいね</span>
        </div>
        {isStaff && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"destructive"}
                  size="sm"
                  className="flex items-center gap-2 text-xs md:text-sm"
                >
                  <Ban className="text-yellow-400 ban cursor-pointer" />
                  BAN
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      ユーザーをBANしますか？
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      このユーザーをBANした場合、このユーザーはRai
                      Chatを利用できなくなります。本当にBANしますか？
                    </p>
                    <h2 className="font-semibold">BANする理由</h2>
                    <Input
                      placeholder="BANする理由を入力してください。"
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Button
                      variant={"destructive"}
                      onClick={handleBAN}
                      className="w-full"
                    >
                      BAN
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"destructive"}
                  size="sm"
                  className="flex items-center gap-2 text-xs md:text-sm"
                >
                  <Trash2 className="text-yellow-400 remove-manually cursor-pointer" />
                  強制削除
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">
                      メッセージを強制削除しますか？
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      このメッセージを強制削除した場合、このメッセージは削除されます。本当に強制削除しますか？
                    </p>
                    <div className="grid gap-2">
                      <Button
                        variant={"destructive"}
                        onClick={handleForceRemove}
                        className="w-full"
                      >
                        強制削除
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
        {messageData.uid === user.uid && (
          <Button variant={"ghost"} className="flex items-center gap-2 remove">
            <Trash2 className=" text-red-500 items-center justify-center" />
            削除
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default MessageElement;
