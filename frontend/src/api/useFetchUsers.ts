import { useState, useEffect } from 'react';
import { getUsers } from './userApi';
import { User } from '../types/types'; // Replace with actual path


const useFetchUsers = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] =  useState<string | null>(null);
  useEffect(() => {
    getUsers()
      .then((responseData: User[]) => {
        setData(responseData);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching data: ', error);
      });
  }, []);

  return { data, error };
};

export default useFetchUsers;