import axios from "axios";
import { failureMessage } from "../notifications/successError";

export const DownloadCompanyDocs=async(regNo:string,loanCat_id:string,ServerFileName:string,id:string)=>{
    const resp= await axios.get(`/api/companies/documents/download?regNo=${regNo}&loanCat_id=${loanCat_id}&id=${id}`,{ responseType: 'blob' });
    if(resp.status!==200 || !resp.data.size){
        failureMessage(resp.statusText);
        return;
    }
    const blob = new Blob([resp.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ServerFileName}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL?.revokeObjectURL(url);    
}