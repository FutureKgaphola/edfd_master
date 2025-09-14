
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchapplications=async(id :string)=>{
   const resp= await axios.get(`/api/companies/retrive/applications?user_email=${id}`);
    return resp.data || [];
}
const useApplications= (id:string) => {
    const {data,isLoading,error} =useQuery({
        queryFn : ()=>fetchapplications(id),
        queryKey: ['applications',{id}],
        enabled: !!id,
    });

    return {data,isLoading,error};
};

export default useApplications;