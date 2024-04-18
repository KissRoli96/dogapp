import { useState, useEffect } from 'react';
import { getUser } from './userApi';

type User = {
    _id: { $oid: string };
    username: string;
    email: string;
    roles: string[];
    profile: {
        firstName: string;
        lastName: string;
        age: number;
        address: {
            city: string;
            country: string;
        };
    };
};

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