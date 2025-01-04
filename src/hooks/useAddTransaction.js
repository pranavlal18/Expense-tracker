import { addDoc, collection, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = () => {
    const transactionCollectionRef = collection(db, "transactions");
    const { userID } = useGetUserInfo();

    
    const addTransaction = async ({
        description,
        transactionAmount,
        transactionType,
    }) => {
        await addDoc(transactionCollectionRef, {
            userID,
            description,
            transactionAmount,
            transactionType,
            createdAt: serverTimestamp(),
        });
    };

   
    const deleteTransaction = async (transactionID) => {
        const transactionDocRef = doc(db, "transactions", transactionID); 
        await deleteDoc(transactionDocRef);
    };

    return { addTransaction, deleteTransaction };
};
