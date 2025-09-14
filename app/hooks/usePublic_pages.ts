import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const usePublic_pages = () => {
    const router=useRouter();
    const IsNotSignedin = () => {
        const Authprop = useSelector((state: RootState) => state.AuthReducer);
        useEffect(()=>{
            if(Authprop?.token)
            {
              router.replace('/dashboard');
            }
           },[Authprop?.token]);
        
    }
    return {IsNotSignedin}
}