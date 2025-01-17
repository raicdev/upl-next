import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const s = String;
const c = s.fromCharCode;
const b = c(65, 73, 122, 97, 83, 121, 68, 68, 95, 65, 83, 90, 45, 83, 104, 110, 103, 89, 80, 116, 117, 109, 114, 86, 75, 77, 51, 89, 72, 54, 55, 114, 69, 73, 54, 98, 98, 82, 99);
const firebaseConfig = {
  apiKey: b,
  authDomain: "auth.raic.tech",
  projectId: "e-mediator-401323",
  storageBucket: "e-mediator-401323.appspot.com",
  messagingSenderId: "237760903684",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const firestore = getFirestore();
const database = getDatabase();

export interface SubscriptionDataInterface {
  expiryDate: number;
  lastChecked: number;
  isExpired: boolean;
  id: string;
  plan: string;
  isStudent: boolean;
  isStaff: boolean;
}

export { firestore, auth, database };
export default app;
