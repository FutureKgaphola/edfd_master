import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { failureMessage, successMessage } from "../notifications/successError";

const useApplyLoan = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    interface companyData {
        user_email: string;
        companyName: string;
        regNo: string;
        amount: string;
        loanDocs: string;
    }
    const HandleSubmitApplication = async ({ user_email, companyName, regNo, amount, loanDocs }: companyData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/companies/apply", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_email, companyName, regNo, amount, loanDocs
                }),
            });
            const result = await response?.json();
            if (!response.ok) {
                failureMessage(result?.message || "An unexpected error occurred");
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["application"] });
            successMessage(result?.message);
            return result; //return an object

        } catch (error: any) {
            failureMessage(error?.message || "An unexpected error occurred");
            return;
        } finally {
            setLoading(false);
        }
    }
    return { HandleSubmitApplication, loading }
}

export default useApplyLoan;