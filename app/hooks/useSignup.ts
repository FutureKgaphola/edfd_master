
import { useState } from "react";
import { failureMessage, successMessage } from "../notifications/successError";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);
    interface SignupData {
        username: string;
        phone: string;
        Name: string;
        LName: string;
        IdNo: string;
        password: string;
    }

    const handleSignup = async ({ username, phone, Name, LName, IdNo, password }: SignupData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/users/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_email: username?.trim(),
                    phone: phone?.trim(),
                    first_name: Name?.trim(),
                    last_name: LName?.trim(),
                    last_update: "never",
                    saId: IdNo?.trim(),
                    password: password
                }),
            });
            const result = await response?.json();
            if (!response.ok) {
                failureMessage(result?.message || "An unexpected error occurred");
                return;
            }
            successMessage(result?.message);
            return result; //return an object
        } finally {
            setLoading(false);
        }
    }

    return { handleSignup, loading }

}

