import api from './api';
import { Service } from '../types/types';

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await api.get<Service[]>('/services');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getService = async (id: string): Promise<Service> => {
  try {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createService = async (serviceData: Partial<Service>): Promise<Service> => {
  try {
    const response = await api.post<Service>('/services', serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateService = async (id: string, serviceData: Partial<Service>): Promise<Service> => {
  try {
    const response = await api.put<Service>(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await api.delete(`/services/${id}`);
  } catch (error) {
    throw error;
  }
};