import { useState, useEffect } from 'react';
import { getDogsByOwnerId } from './dogApi'; 
import { Dog } from '../types/types';

const useFetchDogsByOwnerId = (ownerId: string | undefined) => {
    const [data, setData] = useState<Dog[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!ownerId) {
                setError('Invalid owner ID');
                return;
            }

            try {
                const dogs = await getDogsByOwnerId(ownerId);
                setData(dogs);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchData();
    }, [ownerId]);

    return { data, error };
};

export default useFetchDogsByOwnerId;