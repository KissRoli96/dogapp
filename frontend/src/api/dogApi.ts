import api from './api';
import { Dog } from '../types/types';
import { Status, ErrorResponse } from '../types/types';

export const getDogs = async (): Promise<Dog[]> => {
    try {
        const response = await api.get<Dog[]>('/dogs');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get dogs: ${(error as Error).message}`);
    } 
};

export const getDog = async (id: string): Promise<Dog> => {
    try {
        const response = await api.get<Dog>(`/dog/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get dog with id ${id}: ${(error as Error).message}`);
    }
};

export const createDog = async (dogData: Dog): Promise<Dog | ErrorResponse> => {
    try {
        console.log(dogData);
        const response = await api.post<Dog>('/dog', dogData, {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return { error: error.response.data.message };
        }
        throw error;
    }
};

export const updateDog = async (id: string, dogData: Dog): Promise<Dog> => { 
    try {
        const response = await api.put<Dog>(`/dog/${id}`, dogData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteDog = async (id: string): Promise<void> => {
    try {
        await api.delete(`/dog/${id}`);
    } catch (error) {
        throw error;
    }
};

export const getDogPicture = async (id: string): Promise<Blob> => {
    try {
        const response = await api.get<Blob>(`/dog/${id}/picture`, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get dog picture with id ${id}: ${(error as Error).message}`);
    }
}