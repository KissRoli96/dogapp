import { useState, useEffect } from 'react';
import { getAppointmentsByUserId } from './appointmentApi'; 
import { Appointment } from '../types/types';

const useFetchAppointmentsByUserId = (userId: string | undefined) => {
    const [data, setData] = useState<Appointment[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) {
                setError('Invalid user ID');
                return;
            }

            try {
                const appointments = await getAppointmentsByUserId(userId);
                setData(appointments);
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

export default useFetchAppointmentsByUserId;