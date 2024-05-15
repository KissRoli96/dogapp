import { useState, useEffect } from 'react';
import { getReviewsByUserId } from './reviewApi';
import { Review } from '../types/types';

const useFetchReviewByUserId = (userId: string | undefined) => {
    const [data, setData] = useState<Review[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                setError('Invalid user ID');
                return;
            }

            try {
                const reviews = await getReviewsByUserId(userId);
                setData(reviews);
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

export default useFetchReviewByUserId;