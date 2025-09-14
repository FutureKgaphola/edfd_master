
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';

const fetchContacts=async(userid:string)=>{
   const resp= await axios.get(`/api/companies/retrive/getone?reg=${userid}`)
    return resp.data?.company;
}
const useCompanyIdentification = () => {
    const Authprop = useSelector((state: RootState) => state.SelectedCompanyReducer);
    const selected= Authprop.regNo;
    const {data,isLoading,error} =useQuery({
        queryFn : ()=>fetchContacts(selected),
        queryKey: ['compidentification',{selected}]
        
    });

    return {data,isLoading,error};
};

export default useCompanyIdentification;