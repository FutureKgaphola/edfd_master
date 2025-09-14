

import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';

const fetchContacts=async(userid:string)=>{
   const resp= await axios.get(`/api/users/profile/LeadAddress?id=${userid}`)
    return resp.data?.user;
}
const useFetchLeadAddress = () => {
    const Authprop = useSelector((state: RootState) => state.AuthReducer);
    const userid= Authprop.user?.user_email;
    const {data,isLoading,error} =useQuery({
        queryFn : ()=>fetchContacts(userid),
        queryKey: ['leadAddress',{userid}]
        
    });

    return {data,isLoading,error};
};

export default useFetchLeadAddress;