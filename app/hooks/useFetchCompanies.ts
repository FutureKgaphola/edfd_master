import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchCompanies=(id:string)=>{
    const { data , error, isLoading,isSuccess } = useQuery({
        queryFn: () => axios.get(`/api/companies/retrive?user_email=${id}`),
        queryKey: ['companies',{id}],
        enabled: !!id,
    });

    return {data,error,isLoading,isSuccess};
}