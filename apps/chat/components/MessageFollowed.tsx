import { firestore } from "@repo/firebase/config";
import { UserDataInterface } from "@repo/firebase/types";
import { Loading } from "@repo/ui/components/loading";
import { cn } from "@repo/ui/lib/utils";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

interface MessageFollowedProps {
  userId?: string;
}

const MessageFollowed = ({ userId }: MessageFollowedProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(true);
  const [followedUsers, setFollowedUsers] = React.useState<UserDataInterface[]>(
    []
  );

  const isThisConversion = (userId: string) => {
    return pathname.includes("conversion/" + userId);
  };

  useEffect(() => {
    async function fetchUsers() {
      if (!userId) {
        return;
      }
      const followedUsers = await getDocs(
        collection(firestore, "raichat-user-status", userId, "followedInfo")
      );

      followedUsers.forEach(async (followedDoc) => {
        const userData = followedDoc.data() as UserDataInterface;

        const followedUserDoc = await getDoc(
          doc(firestore, "raichat-user-status", userData.uid)
        );
        const followedData = followedUserDoc.data() as UserDataInterface;
        setFollowedUsers((prev) => [...prev, followedData]);
      });

      setIsLoading(false);
    }

    fetchUsers();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-4/8">
        <h1 className="text-2xl font-bold">ユーザーを選択</h1>
        <p className="text-muted-foreground mb-2">
          ユーザーのページに行き、メッセージボタンをクリックすることでもメッセージを送信できます。
        </p>

        <Loading />
      </div>
    );
  }

  return (
    <div className="w-4/8">
      <h1 className="text-2xl font-bold">ユーザーを選択</h1>
      <p className="text-muted-foreground mb-2">
        ユーザーのページに行き、メッセージボタンをクリックすることでもメッセージを送信できます。
      </p>
      {followedUsers.map((user) => (
        <div
          key={user.uid}
          className={cn(
            "flex items-center justify-between p-2 rounded-md transition-all cursor-pointer",
            isThisConversion(user.uid)
              ? "bg-secondary"
              : "bg-sidebar hover:bg-sidebar/90"
          )}
          onClick={() => {
            router.push(`/conversion/${user.uid}`);
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src={user.image || "/images/chat-defaultProfile.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="font-bold">{user.username}</p>
                <p className="text-muted-foreground">@{user.handle}</p>
              </div>
              <p className="text-muted-foreground">
                ソース：フォロー済みユーザー
              </p>
            </div>
          </div>
        </div>
      ))}{" "}
    </div>
  );
};

export default React.memo(MessageFollowed);
