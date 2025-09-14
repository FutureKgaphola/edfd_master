import axios from "axios";
import { useState } from "react";
import { failureMessage, successMessage } from "../notifications/successError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

export const useDirector = () => {
    const queryClient = useQueryClient();
    const prop = useSelector((state: RootState) => state.SelectedCompanyReducer);
   
    const { data, error, isLoading } = useQuery({
        queryFn: () => axios.get(`/api/Directors/retrive?regno=${prop?.regNo}`),
        queryKey: ['dir' + prop?.regNo],
        enabled: !!prop?.regNo,
    });
    
    const [files, setFiles] = useState<(File | null)[]>([null, null]);
    const [FileIndexes, setFileIndexes] = useState<(number | null)[]>([]);
    const [isUploading, setisuploaading] = useState<boolean>(false);

    const handleFileChange = (index: number, file: File | null, called: string) => {
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
        console.log(updatedFiles);
        setFiles(updatedFiles);
        setFileIndexes([...FileIndexes, index]);
    };

    const { mutateAsync: addDirectorWithDocs } = useMutation({
        mutationFn: async ({ regNo, fullnames, email, phone, called,percentage }:
            { regNo: string; fullnames: string; email: string; phone: string, called: string,percentage:string }) =>
            handleMultiplePdfUpload(regNo, fullnames, email, phone, called,percentage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dir" + prop?.regNo] });
        },
    });

    const handleMultiplePdfUpload = async (regNo: string, fullnames: string, email: string, phone: string, called: string,percentage:string) => {
        
        if (called == "add") {
            if (!files.every(file => file !== null)) {
                failureMessage("Please upload both required files.");
                return;
            }   
        }
        const totalSize = files?.reduce((acc, curr) => acc + (curr?.size || 0), 0);
        if (totalSize > 900 * 1024 * 1024) {
            failureMessage("Total file size should not exceed 900MB");
            return;
        }
        const formData = new FormData();
        formData.append("fullnames", fullnames);
        formData.append("phone", phone);
        formData.append("regNo", regNo);
        formData.append("email", email);
        formData.append("percentage",percentage);

        FileIndexes.forEach((index:any, idx:any) => formData.append(`FileIndexes${idx}`, index !== null ? index.toString() : ''));
        formData.append("fileDataCopyId", files[1] as File);
        formData.append("fileDataRess", files[0] as File);
        formData.append("docsCount", files.length.toString());

        try {
            setisuploaading(true);
            let response = null;
            if (called == "update") {
                response = await axios.patch(`/api/Directors/update`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                response = await axios.post(`/api/Directors/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            if (response.status === 200 || response.status === 201) {
                successMessage(response.data?.message);
                setisuploaading(false);
                setFileIndexes([]);
                setFiles([null, null]);
                return response;
            } else {
                failureMessage(response.data?.message);
                setisuploaading(false);
                return response;
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message;
            failureMessage(errorMessage);
            setisuploaading(false);
        }
    };

    return { handleFileChange, addDirectorWithDocs,isUploading, data, error, isLoading };
};
