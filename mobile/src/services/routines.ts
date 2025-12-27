import { apiClient } from './api';
import { Routine } from '../types';

export const routinesService = {
  async getAll(): Promise<Routine[]> {
    return apiClient.get<Routine[]>('/routines');
  },

  async getById(id: string): Promise<Routine> {
    return apiClient.get<Routine>(`/routines/${id}`);
  },

  async create(routine: Partial<Routine>): Promise<Routine> {
    return apiClient.post<Routine>('/routines', routine);
  },

  async update(id: string, routine: Partial<Routine>): Promise<Routine> {
    return apiClient.put<Routine>(`/routines/${id}`, routine);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/routines/${id}`);
  },
};
