import axios from "axios";
import { useState } from "react";
import { failureMessage, successMessage } from "../notifications/successError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadBusiness = () => {
    const queryClient = useQueryClient();
    const [FileIndexes, setFileIndexes] = useState<(number | null)[]>([]);
    const [Filerror, setError] = useState('');
    const [Isuploaading, setisuploaading] = useState<boolean>(false);

    const [files, setFiles] = useState<(File | null)[]>([null, null, null, null, null, null, null, null]);
    const handleFileChange = (index: number, file: File | null) => {
        if (file) {
            if (file.type !== 'application/pdf') {
                failureMessage('Please upload a valid PDF file.');
                return;
            }
            if (file.size > 40 * 1024 * 1024) {
                failureMessage('File size must be less than 40 MB.');
                return;
            }
        }

        const updatedFiles = [...files];
        updatedFiles[index] = file;
        setFiles(updatedFiles);
        setFileIndexes([...FileIndexes, index]);
    };

    const {mutateAsync:AddCompanyDocs}=useMutation({
        mutationFn:async({ regNo, loanId }: { regNo: string, loanId: string }) => HandleMultiplePdfUpload(regNo, loanId),
        onSuccess: (_, { loanId }) => {
            let qkey=loanId === "0" ? "BDocs" : loanId === "1" ? "ProcDocs" : loanId === "2" ? "BuildDocs" : loanId === "3" ? "FraDocs": "";
            queryClient.invalidateQueries({ queryKey: [qkey] });
        }
    });
    const HandleMultiplePdfUpload = async (regNo: string, loanId: string) => {
        if (!files.some(file => file !== null)) {
            failureMessage("Please upload at least one file.");
            return;
        }
        //Combined size of files must be less than 900 MB
        const totalSize = files.reduce((acc, curr) => acc + (curr?.size || 0), 0);
        if (totalSize > 900 * 1024 * 1024) {  // 900MB in bytes
            setError('Total file size should not exceed 900MB');
            failureMessage("Total file size should not exceed 900MB");
            return;
        }
        const formData = new FormData();
        if (files) {
            formData.append("loanId", loanId);
            formData.append("regNo", regNo);
            FileIndexes.forEach((fi, index) => formData.append('FileIndexes' + index, fi !== null ? fi.toString() : ''));
            files.filter(f => f !== null).forEach((f, index) => formData.append('file' + index, f as File));
            formData.append("docsCount", files.length.toString());
        }
        try {
            setisuploaading(true);
            const response = await axios.post('/api/upload/business', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                successMessage(response.data?.message);
                setisuploaading(false);
                setFiles([null, null, null, null, null, null, null, null]);
                setFileIndexes([]);
            } else {
                failureMessage(response.data?.message);
                setisuploaading(false);
            }
        } catch (err: any) {
            failureMessage(err.message);
            console.log(err?.message);
            setisuploaading(false);
            setError(err?.message);
        }

    }
    return { handleFileChange, AddCompanyDocs, Filerror, files, Isuploaading }
}
