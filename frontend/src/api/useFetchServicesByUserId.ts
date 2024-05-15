import { useState, useEffect } from 'react';
import { getServicesByUserId } from './serviceApi';
import { Service } from '../types/types';

const useFetchServicesByUserId = (userId: string | undefined) => {
    const [data, setData] = useState<Service[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                setError('Invalid user ID');
                return;
            }

            try {
                const services = await getServicesByUserId(userId);
                setData(services);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchData();
    }, [userId]);

    return { data, error };
};

export default useFetchServicesByUserId;