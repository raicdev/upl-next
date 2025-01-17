import { useEffect, useState } from "react";
import { SubscriptionDataInterface } from "@firebase/types";
import { auth, firestore } from "@firebase/config";
import { getDoc, doc, collection } from "firebase/firestore";
import { multiFactor, User } from "firebase/auth";

export function useFetchTFAData() {
    const [isTFAEnabled, setIsTFAEnabled] = useState(false);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setIsTFAEnabled(false);
          return;
        }
  
        const factorsCount = multiFactor(user).enrolledFactors.length;
        setIsTFAEnabled(factorsCount >= 1);
      });
  
      return () => unsubscribe();
    }, []);
  
    return isTFAEnabled;
  }