import { useEffect, useState } from "react";
import { query, collection, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const { userID } = useGetUserInfo(); // Assuming this hook returns userID
  
  const transactionCollectionRef = collection(db, "transactions");

  useEffect(() => {
    if (!userID) return; // Avoid executing if userID is not available

    const queryTransactions = query(
      transactionCollectionRef,
      where("userID", "==", userID),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTransactions(docs);
    });

    return () => unsubscribe();
  }, [userID]); // Ensure this effect runs only when userID changes

  return { transactions };
};
