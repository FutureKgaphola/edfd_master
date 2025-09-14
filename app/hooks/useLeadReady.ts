import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';

// Utility: Count empty fields in an object
const countEmptyFields = (obj: Record<string, any>) => {
    if (!obj) return { empty: 0, total: 0 };

    let empty = 0;
    const entries = Object.entries(obj);
    const total = entries.length;

    entries.forEach(([_, value]) => {
        if (
            value === null ||
            value === undefined ||
            (typeof value === 'string' && value.trim() === '') ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
        ) {
            empty += 1;
        }
    });

    return { empty, total };
};

const fetchContacts = async (userid: string) => {
    const resp = await axios.get(`/api/users/profile/LeadContact?id=${userid}`);
    return resp.data?.user;
};

const useLeadReady = () => {
    const [emptyFieldsCount, setEmptyFieldsCount] = useState<number | null>(null);
    const [totalFieldsCount, setTotalFieldsCount] = useState<number | null>(null);
    const [completionPercentage, setCompletionPercentage] = useState<number | null>(null);

    const Authprop = useSelector((state: RootState) => state.AuthReducer);
    const userid = Authprop.user?.id;

    const { data, isLoading, error } = useQuery({
        queryFn: () => fetchContacts(userid),
        queryKey: ['LeadReady', { userid }],
        enabled: !!userid,
    });

    useEffect(() => {
        if (data) {
            const { empty, total } = countEmptyFields(data);
            setEmptyFieldsCount(empty);
            setTotalFieldsCount(total);
            const percentage = total > 0 ? ((total - empty) / total) * 100 : 0;
            setCompletionPercentage(parseFloat(percentage.toFixed(2)));

            //console.log(`Empty fields: ${empty}`);
            //console.log(`Total fields: ${total}`);
           // console.log(`Completion %: ${percentage.toFixed(2)}%`);
        }
    }, [data]);

    return { data, isLoading, error, emptyFieldsCount, totalFieldsCount, completionPercentage };
};

export default useLeadReady;
