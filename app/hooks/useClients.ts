import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useClients=()=>{
    const { data , error, isLoading,isSuccess } = useQuery({
        queryFn: () => axios.get(`api/clients/retrive`),
        queryKey: ['clients'],
    });

    return {data,error,isLoading,isSuccess};
}