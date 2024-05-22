import { useState, useEffect } from 'react';
import { getUser } from './userApi';
import { User } from '../types/types'; 

const useFetchUserById = (id: string | undefined) => {
    const [data, setData] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Invalid user ID');
                return;
            }

            try {
                const user = await getUser(id);
                setData(user);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchData();
    }, [id]);

    return { data, error };
};

export default useFetchUserById;