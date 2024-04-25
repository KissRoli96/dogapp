import { useState, useEffect } from 'react';
import { getServices } from './serviceApi';
import { Service } from '../types/types';

const useFetchServices = () => {
  const [data, setData] = useState<Service[] | null>(null);
  const [error, setError] =  useState<string | null>(null);
  useEffect(() => {
    getServices()
      .then((responseData: Service[]) => {
        setData(responseData);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching data: ', error);
      });
  }, []);

  return { data, error };
};

export default useFetchServices;