import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useInternalStaff=()=>{
    const { data , error, isLoading,isSuccess } = useQuery({
        queryFn: () => axios.get(`api/internalstaff/retrive`),
        queryKey: ['staff'],
    });

    return {data,error,isLoading,isSuccess};
}