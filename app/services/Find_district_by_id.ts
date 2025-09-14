import axios from "axios";

export const getDistrict = async (districtId: string): Promise<string> => {
    if(districtId && districtId!==''){
        const resp = await axios.get(`/api/District/getById?id=${districtId}`);
        if(resp?.status==200){
            return resp.data.District.districtName || '';
        }
        return '';
    }
    return '';
    
}