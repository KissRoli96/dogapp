import { useState, useEffect } from 'react';
import { getApplications } from './applicationApi';
import { Application } from '../types/types';

const useFetchApplications = () => {
  const [data, setData] = useState<Application[] | null>(null);
  const [error, setError] =  useState<string | null>(null);
  useEffect(() => {
    getApplications()
      .then((responseData: Application[]) => {
        setData(responseData);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching data: ', error);
      });
  }, []);

  return { data, error };
};

export default useFetchApplications;