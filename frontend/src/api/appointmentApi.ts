import api from './api';
import { Appointment, ErrorResponse } from '../types/types';

export const getAppointments = async (): Promise<Appointment[]> => {
    try {
        const response = await api.get<Appointment[]>('/appointments');
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get appointments: ${(error as Error).message}`);
    } 
};

export const getAppointment = async (id: string): Promise<Appointment> => {
    try {
        const response = await api.get<Appointment>(`/appointment/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get appointment with id ${id}: ${(error as Error).message}`);
    }
};

export const createAppointment = async (appointmentData: Appointment): Promise<Appointment | ErrorResponse> => {
    try {
        const response = await api.post<Appointment>('/appointment', appointmentData);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return { error: error.response.data.message };
        }
        throw error;
    }
};

export const updateAppointment = async (id: string, appointmentData: Appointment): Promise<Appointment> => { 
    try {
        const response = await api.put<Appointment>(`/appointment/${id}`, appointmentData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteAppointment = async (id: string): Promise<void> => {
    try {
        await api.delete(`/appointment/${id}`);
    } catch (error) {
        throw error;
    }
};

export const rescheduleAppointment = async (id: string, newSchedule: { date: string, startTime: string, endTime: string }): Promise<Appointment> => {
    try {
        const response = await api.post<Appointment>(`/appointment/${id}/reschedule`, newSchedule);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to reschedule appointment with id ${id}: ${(error as Error).message}`);
    }
};

export const getAppointmentsByUserId = async (userId: string): Promise<Appointment[]> => {
    try {
        const response = await api.get<Appointment[]>(`/appointments?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to get appointments for user with id ${userId}: ${(error as Error).message}`);
    }
};

export const updateAppointmentStatus = async (id:string, status: string): Promise<Appointment> => {
    try {
        const response = await api.put<Appointment>(`/appointment/${id}/status`, { status });
        return response.data;
    }  catch (error) {
        throw error;
    }
}