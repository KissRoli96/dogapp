import { useState, useEffect } from 'react';
import { getUsers } from './UserApi';

const useFetchUsers = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then(responseData => {
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