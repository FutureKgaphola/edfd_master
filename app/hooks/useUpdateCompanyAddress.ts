import { FormEvent, useState } from 'react';
import axios from 'axios';
import { failureMessage, successMessage } from '../notifications/successError';
import { useSignout } from './useSignout';
import { useQueryClient } from '@tanstack/react-query';

const useUpdateCompamyAddress = () => {
    const queryClient = useQueryClient();
    const { handleSigOut } = useSignout();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const submitForm = async (e: FormEvent<HTMLFormElement>,physical:string,postal:string,
        file: (File | null)[],user_id:string,user_email:string,property:string,districtId:string) => {
        e.preventDefault();
        if (file && file[0] && file[0].size > 40 * 1024 * 1024) {
            setError('File size should not exceed 40MB');
            return;
        }
        
        const formData = new FormData();
        formData.append('physical', physical);
        formData.append('postal', postal);
        formData.append('id', user_id);
        formData.append('user_email', user_email);
        formData.append("property",property);
        formData.append("districtId",districtId);
        if (file) {
            
            if (file[0]) {
                formData.append('file0', file[0]);
                formData.append('proof_filename', file[0]?.name || '');
            }
            if (file[1]) {
                formData.append('file1', file[1]);
                formData.append('lease_filename', file[1]?.name || '');
            }
        }
       
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await axios.patch('/api/upload/company/address', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                //setSuccess(true);
                successMessage("Successful update");
                queryClient.invalidateQueries({ queryKey: ["companyAddress"] });
                //handleSigOut();
            } else {
                failureMessage("Failed to submit the form");
                setError('Failed to submit the form');
            }
        } catch (err:any) {
            failureMessage(err.message);
            setError('An error occurred while submitting the form');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, success, submitForm };
};

export default useUpdateCompamyAddress;