import api from './api';
import { Review } from '../types/types';

export const getReviews = async (): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>('/reviews');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReview = async (id: string): Promise<Review> => {
  try {
    const response = await api.get<Review>(`/review/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review> => {
  try {
    const response = await api.post<Review>('/review', reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (id: string, reviewData: Partial<Review>): Promise<Review> => {
  try {
    const response = await api.put<Review>(`/review/${id}`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await api.delete(`/review/${id}`);
  } catch (error) {
    throw error;
  }
};

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>(`/reviews?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get reviews by user ID ${userId}: ${(error as Error).message}`);
  }
}

export const updateReviewStatus = async (id: string, status: string): Promise<Review> => {
  try {
    const response = await api.put<Review>(`/review/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
}

