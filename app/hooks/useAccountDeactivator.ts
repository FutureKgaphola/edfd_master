import { useState } from "react";
import { failureMessage, successMessage } from "../notifications/successError";
import { useQueryClient } from "@tanstack/react-query";

export const useAccountDeactivator = () => {
const queryClient = useQueryClient();
const [loading, setLoading] = useState(false);
const Deactivate=async(id:string,table:string,invalidate:string)=>{
    try {
         const response = await fetch("/api/account/active", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,table,action:0
                }),
            });
            const result = await response?.json();
            if (!response.ok) {
                failureMessage(result?.message || "An unexpected error occurred");
                return;
            }
            queryClient.invalidateQueries({ queryKey: [invalidate] });
            successMessage(result?.message);
            //return result;
        
    } catch (error:any) {
        failureMessage(error?.message || "An unexpected error occurred");
            return;
    }finally{
        setLoading(false);
    }

}

const Activate=async(id:string,table:string,invalidate:string)=>{
    try {
         const response = await fetch("/api/account/active", {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,table,action:1
                }),
            });
            const result = await response?.json();
            if (!response.ok) {
                failureMessage(result?.message || "An unexpected error occurred");
                return;
            }
            queryClient.invalidateQueries({ queryKey: [invalidate] });
            successMessage(result?.message);
            //return result;
    } catch (error:any) {
        failureMessage(error?.message || "An unexpected error occurred");
            return;
    }finally{
        setLoading(false);
    }
}


 return { Deactivate,Activate, loading }
}
    