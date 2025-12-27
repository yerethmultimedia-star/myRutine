import { apiClient } from './api';
import { Task } from '../types';

export interface TaskFilters {
  routine_id?: string;
  is_completed?: boolean;
  is_paused?: boolean;
}

export const tasksService = {
  async getAll(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.routine_id) params.append('routine_id', filters.routine_id);
    if (filters?.is_completed !== undefined) params.append('is_completed', String(filters.is_completed));
    if (filters?.is_paused !== undefined) params.append('is_paused', String(filters.is_paused));

    const query = params.toString();
    return apiClient.get<Task[]>(`/tasks${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}`);
  },

  async create(task: Partial<Task>): Promise<Task> {
    return apiClient.post<Task>('/tasks', task);
  },

  async update(id: string, task: Partial<Task>): Promise<Task> {
    return apiClient.put<Task>(`/tasks/${id}`, task);
  },

  async complete(id: string): Promise<{ task: Task; xp_earned: number }> {
    return apiClient.post<{ task: Task; xp_earned: number }>(`/tasks/${id}/complete`);
  },

  async uncomplete(id: string): Promise<Task> {
    return apiClient.post<Task>(`/tasks/${id}/uncomplete`);
  },

  async pause(id: string): Promise<Task> {
    return apiClient.post<Task>(`/tasks/${id}/pause`);
  },

  async resume(id: string): Promise<Task> {
    return apiClient.post<Task>(`/tasks/${id}/resume`);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/tasks/${id}`);
  },
};
