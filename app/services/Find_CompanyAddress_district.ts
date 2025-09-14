import axios from "axios";

export const getCompanyDistrictID = async (email: string,regno:string): Promise<string> => {
    if(email && regno && regno!=='---'){
        const resp = await axios.get(`/api/companies/retrive/CompanyDistrictID?email=${email}&regNo=${regno}`);
        if(resp?.status==200){
            return resp.data.districtId || '';
        }
        return '';
    }
    return '';
    
}