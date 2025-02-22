import { UserDataInterface } from "@firebase/types";
import {
  authAdmin,
  databaseAdmin,
  firestoreAdmin,
  notAvailable,
} from "@firebase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: {
    content: string;
    image: string;
  };
  if (notAvailable || !authAdmin || !databaseAdmin || !firestoreAdmin) {
    return NextResponse.json(
      {
        statusMessage: "Internal Server Error",
        errorCode: "not-available",
        errorMessage: "サーバーが利用できません。",
      },
      { status: 500 }
    );
  }

  try {
    body = await req.json();
  } catch (error) {
    console.error(
      "[ERROR] Client Side Response Error: Invalid JSON format",
      error
    );
    return NextResponse.json(
      {
        statusMessage: "Bad Request",
        errorCode: "invalid-json-format",
        errorMessage: "リクエストボディが正しいJSON形式ではありません。",
      },
      { status: 400 }
    );
  }

  const content = body.content;
  const image = body.image;
  const idToken = req.headers.get("Authorization");

  if (!content) {
    console.error(
      "[ERROR] Client Side Response Error: content is not set (/api/send)",
      req.body
    );
    return NextResponse.json(
      {
        statusMessage: "Bad Request",
        errorCode: "required-options-not-set",
        errorMessage: "必要なオプション ('message'が設定されていません。)",
      },
      { status: 400 }
    );
  }

  if (!idToken) {
    console.error(
      "[ERROR] Client Side Response Error: idToken is not set (/api/send)"
    );

    return NextResponse.json(
      {
        statusMessage: "Unauthorized",
        errorCode: "required-options-not-set",
        errorMessage: "必要なオプション ('idToken'が設定されていません。)",
      },
      { status: 401 }
    );
  }

  const verifiedUser = await authAdmin.verifyIdToken(idToken);

  const user = await authAdmin.getUser(verifiedUser.uid);
  const ngWords = [
    "死ね",
    "殺す",
    "殺害",
    "アホ",
    "バカ",
    "カス",
    "ころす",
    "しね",
    "あほ",
    "アダルト",
    "エロ",
    "うんこ",
    "まんこ",
    "ちんこ",
    "セックス",
    "sex",
    "fuck",
    "マン凸",
    "チン凸",
    "pornhub.com",
    "xvideos.com",
  ];

  const timestamp = Date.now();
  const ref = databaseAdmin.ref(
    "messages_new_20240630/" + timestamp + "-" + user.uid
  );

  const doc = firestoreAdmin.doc("raichat-user-status/" + user.uid);
  const snapshot = await doc.get();

  if (user.displayName) {
    const snapshotData = snapshot.data() as UserDataInterface;
    if (
      ngWords.some((word) => content.includes(word)) ||
      user.displayName === "Rai Chat System"
    ) {
      await ref.set({
        username: user.displayName,
        paid: snapshotData.checkmarkState ? "free" : snapshotData.paid,
        verified: false,
        uid: user.uid,
        id: timestamp + "-" + user.uid,
        isSystemMessage: true,
        time: new Date().toLocaleString(),
        edited: false,
        message: "このメッセージの内容は、Rai Chatの利用規約に違反しています。",
        favorite: 0,
      });
      snapshotData.banned = true;

      if (ngWords.some((word) => content.includes(word))) {
        snapshotData.banReason = "不適切な言葉遣い";
      }
      if (user.displayName === "Rai Chat System") {
        snapshotData.banReason = "なりすまし";
      }
      if (ngWords.some((word) => user.displayName?.includes(word))) {
        snapshotData.banReason = "不適切な名前";
      }

      await doc.set(snapshotData);

      return NextResponse.json(
        { action: "banned" },
        {
          status: 403,
        }
      );
    } else {
      try {
        await ref.set({
          //todo: message id
          username: user.displayName,
          paid: snapshotData.checkmarkState ? "free" : snapshotData.paid,
          verified: snapshotData.verified,
          image: image,
          uid: user.uid,
          id: timestamp + "-" + user.uid,
          edited: false,
          time: new Date().toLocaleString(),
          message: content,
          favorite: 0,
        });
        return NextResponse.json({ action: "success" });
      } catch (error) {
        console.error("[ERROR] Server Side Response Error:", error);
        NextResponse.json(
          {
            statusMessage: "Internal Server Error",
            errorCode: "server-error",
            errorMessage:
              "リクエストに失敗しました: サーバーでエラーが発生しました",
          },
          { status: 500 }
        );
      }
    }
  }
}
