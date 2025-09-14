import { AuthActions } from "@/lib/features/Auth/AuthuserSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { successMessage } from "../notifications/successError";
import { useRouter } from "next/navigation";

export const useSignout = () => {
    const dispatch = useDispatch();
    const router=useRouter();
    const [errorLogout, setError] = useState(null);
    const handleSigOut = async () => {
        try {
            dispatch(AuthActions.clearAuthToken());
            successMessage("User logged out");
            router.replace('/');
        } catch (error:any) {
            setError(error.message);
        }
    }
    return { handleSigOut, errorLogout }
}

