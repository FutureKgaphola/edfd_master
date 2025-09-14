
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { failureMessage, successMessage } from '../notifications/successError';
import { useState } from 'react';

const fetchDocs = async (loanCat_id: string, regNo: string) => {
    const resp = await axios.get(
        `/api/companies/documents/retrive?regNo=${regNo}&loanCat_id=${loanCat_id}`
    );
    if (!resp.data?.documents || resp.status === 400) return [];
    return resp.data.documents;
}
const useBusinessDocs = () => {
    
    const queryClient = useQueryClient();
    const [file, setPdfFile] = useState<File | null>(null);
    const [IsuploadingUpdates, setIsuploadingUpdates] = useState<boolean>(false);
    const selectedprop = useSelector((state: RootState) => state.SelectedCompanyReducer);
    const regNo = selectedprop?.regNo;
    const loanCat_id = selectedprop?.loanCat_id;

    const { data, isLoading, error } = useQuery({
        queryFn: () => fetchDocs(loanCat_id, regNo),
        queryKey: [loanCat_id === "0" ? "BDocs" : loanCat_id === "1" ? "ProcDocs" : loanCat_id === "2" ? "BuildDocs" : loanCat_id === "3" ? "FraDocs": "", { loanCat_id, regNo }],
       // staleTime: Infinity
       enabled: !!loanCat_id && !!regNo
    });
    const {mutateAsync:UpdateCompanyDocs}=useMutation({
        mutationFn:async({ regNo, loanCat_id, fileIndexes, id }: { regNo: string; loanCat_id: string; fileIndexes: string; id: string }) => UpdateDocs(regNo, loanCat_id, fileIndexes, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [loanCat_id === "0" ? "BDocs" : loanCat_id === "1" ? "ProcDocs" : loanCat_id === "2" ? "BuildDocs" : loanCat_id === "3" ? "FraDocs": ""] });
        }
    });
    const {mutateAsync:RemoveCompanyDocs}=useMutation({
        mutationFn:async({ id, regNo, loanCat_id,fileIndexes  }: { id:string, regNo:string, loanCat_id:string,fileIndexes:string }) => DeleteDoc(id, regNo, loanCat_id,fileIndexes ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [loanCat_id === "0" ? "BDocs" : loanCat_id === "1" ? "ProcDocs" : loanCat_id === "2" ? "BuildDocs" : loanCat_id === "3" ? "FraDocs": ""] });
        }
    });
    const UpdateDocs = async (regNo: string, loanCat_id: string, fileIndexes: string, id: string) => {
        if (!file) return;
        if (file.size > 40 * 1024 * 1024) {
            failureMessage('File size should not exceed 40MB');
            return;
        }
        const formData = new FormData();
        formData.append('regNo', regNo);
        formData.append('loanCat_id', loanCat_id);
        formData.append('fileIndexes', fileIndexes);
        formData.append('id', id);
        formData.append('file', file);
        formData.append('filenames', file.name);
    
        try {
            setIsuploadingUpdates(true);
            const response = await axios.patch('/api/companies/documents/update/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: [loanCat_id === "0" ? "BDocs" : loanCat_id === "1" ? "ProcDocs" : loanCat_id === "2" ? "BuildDocs" : loanCat_id === "3" ? "FraDocs": ""] });
                successMessage(response.data?.message);
                setPdfFile(null);

            } else {
                failureMessage(response.data?.message);
            }
        } catch (err: any) {
            console.error(err?.message);
            failureMessage(err?.message);
        } finally {
            setIsuploadingUpdates(false);
        }
    };
    
    const handleFileChange_update = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            if(event.target.files[0] === undefined || event.target.files[0] === null) {setPdfFile(null);  return;} 
            
            // Validate the file size (should not exceed 40MB)
            if (file.size > 40 * 1024 * 1024) {  // 40MB in bytes
                failureMessage('File size exceeds the 40MB limit.');
                setPdfFile(null);  // Clear the file
            } else {
                setPdfFile(file);
            }
        }
    };

    const DeleteDoc=async(id:string, regNo:string, loanCat_id:string,fileIndexes:string)=>{
        try {
            setIsuploadingUpdates(true);
            const response = await axios.delete(`api/companies/documents/deletedocs?id=${id}&regNo=${regNo}&loanCat_id=${loanCat_id}&fileIndexes=${fileIndexes}`);
    
            if (response.status === 200) {
                queryClient.invalidateQueries({ queryKey: [loanCat_id === "0" ? "BDocs" : loanCat_id === "1" ? "ProcDocs" : loanCat_id === "2" ? "BuildDocs" : loanCat_id === "3" ? "FraDocs": ""] });
                successMessage(response.data?.message);
            } else {
                failureMessage(response.data?.message);
            }
        } catch (err: any) {
            console.error(err?.message);
            failureMessage(err?.message);
        } finally {
            setIsuploadingUpdates(false);
        }
    }
    return { data, isLoading, error,IsuploadingUpdates,UpdateCompanyDocs,RemoveCompanyDocs, handleFileChange_update};
};

export default useBusinessDocs;