import { FormEvent, useState } from 'react';
import axios from 'axios';
import { failureMessage, successMessage } from '../notifications/successError';
import { useSignout } from './useSignout';
import { useQueryClient } from '@tanstack/react-query';

const useUpdatePersonal = () => {
    const queryClient = useQueryClient();
    const { handleSigOut } = useSignout();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const submitForm = async (first_name: string,user_email:string,last_name:string,
        phone:string,saId:string, file: (File | null)[],
        user_id:string,e: FormEvent<HTMLFormElement>,
        SpouceName:string,SpouceId:string,
        SpoucePhone:string,SpouceEmail:string,marital_status:string) => {
        e.preventDefault();
        if (file && file[0] && file[0].size > 40 * 1024 * 1024) {
            setError('File size should not exceed 40MB');
            return;
        }
        
        const formData = new FormData();
        formData.append('first_name', first_name);
        formData.append('user_email', user_email);
        formData.append('last_name', last_name);
        formData.append('phone', phone);
        formData.append('saId', saId);
        formData.append('id', user_id);

        formData.append('SpouceName', SpouceName);
        formData.append('SpouceId', SpouceId);
        formData.append('SpoucePhone', SpoucePhone);
        formData.append('SpouceEmail', SpouceEmail);
        formData.append('marital_status', marital_status);
             
        if (file) {
            
            if (file[0]) {
                formData.append('file0', file[0]);
                formData.append('filename', file[0]?.name || '');
            }

            if (file[1]) {
                formData.append('file1', file[1]);
                formData.append('maritalDocfilename', file[1]?.name || '');
                console.log(file[1]?.name || '');
            }

            if (file[2]) {
                formData.append('file2', file[2]);
                formData.append('SpouceIDfilename', file[2]?.name || '');
            }
        }
       

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await axios.patch('/api/upload/personal/contacts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                //setSuccess(true);
                successMessage("Successful update");
                queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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

export default useUpdatePersonal;