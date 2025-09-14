
import { useState } from "react";
import { failureMessage, successMessage } from "../notifications/successError";
import { useQueryClient } from "@tanstack/react-query";

export const useAddCompanies = () => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    interface companyData {
        user_email: string;
        TradeName: string;
        regNo: string;
        TaxNo:string;
        VatNo:string;
    }
    const handleAddCompanies = async ({ user_email, TradeName, regNo,TaxNo, VatNo }: companyData) => {
        setLoading(true);
        try {
            const response = await fetch("/api/companies/register/identification", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_email, TradeName, regNo,TaxNo, VatNo
                }),
            });
            const result = await response?.json();
            if (!response.ok) {
                failureMessage(result?.message || "An unexpected error occurred");
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["Registeredcompanies"] });
            successMessage(result?.message);
            return result; //return an object
        }catch(error:any){
            failureMessage(error?.message || "An unexpected error occurred");
            return;
        }
         finally {
            setLoading(false);
        }
    }

    return { handleAddCompanies, loading }

}

