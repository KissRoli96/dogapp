import api from './api';
import { Application } from '../types/types';
import { Status, ErrorResponse } from '../types/types';

export const getApplications = async (): Promise<Application[]> => {
  try {
    const response = await api.get<Application[]>('/applications');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApplication = async (id: string): Promise<Application> => {
  try {
    const response = await api.get<Application>(`/application/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createApplication = async (applicationData: FormData): Promise<Application | ErrorResponse> => {
  try {
    const response = await api.post<Application>('/application', applicationData, {
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

export const updateApplication = async (id: string, applicationData: FormData): Promise<Application> => {
  try {
    const response = await api.put<Application>(`/application/${id}`, applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteApplication = async (id: string): Promise<void> => {
  try {
    await api.delete(`/application/${id}`);
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (id: string, status: Status): Promise<Application> => {
  try {
    const response = await api.put<Application>(`/application/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};