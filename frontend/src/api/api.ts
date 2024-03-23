import axios from 'axios';
import dotenv from 'dotenv';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error fetching data: ', error);
    throw error;
  }
);

export default api;