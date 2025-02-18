import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabaseWithUrl } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps()?.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY === undefined) {
    console.error("FIREBASE_SERVICE_ACCOUNT_KEY is not defined in .env file");
  } else {
    initializeApp({
      credential: cert(
        // 環境変数から認証情報を取得
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
      ),
    });
  }
}

export const notAvailable =
  !process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY === undefined;
export const authAdmin = () => {
  if (notAvailable) {
    return null;
  }
  getAuth();
};
export const firestoreAdmin = () => {
  if (notAvailable) {
    return null;
  }
  getFirestore();
};
export const databaseAdmin = () => {
  if (notAvailable) {
    return null;
  }
  getDatabaseWithUrl("https://e-mediator-401323-default-rtdb.firebaseio.com");
};
