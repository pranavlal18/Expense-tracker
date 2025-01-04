import { useNavigate } from "react-router-dom"; 
import { auth } from "../config/firebase-config"  

export const useSignOut = () => {
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            await auth.signOut();
            alert("You have been signed out successfully!");
            navigate("/"); 
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to sign out. Please try again.");
        }
    };

    return { signOut };
};
