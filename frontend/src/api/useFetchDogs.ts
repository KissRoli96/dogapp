import { useState, useEffect } from "react";
import { getDogs } from "./dogApi";
import { Dog } from '../types/types';

const useFetchDogs = () => {
  const [data, setData] = useState<Dog[] | null>(null);
  const [error, setError] =  useState<string | null>(null);
  useEffect(() => {
    getDogs()
      .then((responseData: Dog[]) => {
        setData(responseData);
      })
      .catch(error => {
        setError(error.message);
        console.error('Error fetching data: ', error);
      });
  }, []);

  return { data, error };
}

export default useFetchDogs;