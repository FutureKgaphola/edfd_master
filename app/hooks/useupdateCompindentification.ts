import { FormEvent, useState } from 'react';
import axios from 'axios';
import { failureMessage, successMessage } from '../notifications/successError';
import { useSignout } from './useSignout';
import { useQueryClient } from '@tanstack/react-query';

const useupdateCompindentification = () => {
    const queryClient = useQueryClient();
    const { handleSigOut } = useSignout();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const submitForm = async ( user_email:string, TradeName:string, regNo:string, TaxNo:string, VatNo:string,e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('TradeName', TradeName);
        formData.append('user_email', user_email);
        formData.append('regNo', regNo);
        formData.append('TaxNo', TaxNo);
        formData.append('VatNo', VatNo);

        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const response = await axios.patch('/api/upload/company/compidentification', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                //setSuccess(true);
                successMessage("Successful update");
                queryClient.invalidateQueries({ queryKey: ["compidentification"] });
                queryClient.invalidateQueries({ queryKey: ["Registeredcompanies"] });
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

export default useupdateCompindentification;