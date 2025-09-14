

import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';

const fetchCompanyAddress=async(userid:string,regNo:string)=>{
   const resp= await axios.get(`/api/companies/retrive/CompanyAddress?id=${userid}&regNo=${regNo}`)
    return resp.data?.user;
}
const useFetchCompanyAddress = () => {
    const Authprop = useSelector((state: RootState) => state.SelectedCompanyReducer);
    const selected = useSelector((state: RootState) => state.SelectedCompanyReducer);
    const userid= selected?.email;
    const regNo= selected.regNo;
    const {data,isLoading,error} =useQuery({
        queryFn : ()=>fetchCompanyAddress(userid,regNo),
        queryKey: ['companyAddress',{userid,regNo}]
        
    });

    return {data,isLoading,error};
};

export default useFetchCompanyAddress;