import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabaseWithUrl } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps()?.length) {
  initializeApp({
    credential: cert(
      // 環境変数から認証情報を取得
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)
    )
  });
}

export const authAdmin = getAuth();
export const firestoreAdmin = getFirestore();
export const databaseAdmin = getDatabaseWithUrl(
  "https://e-mediator-401323-default-rtdb.firebaseio.com"
);
console.log("Firebase Admin SDK initialized");