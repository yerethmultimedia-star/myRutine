import { apiClient } from './api';
import { User, Badge } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/user/profile');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>('/user/profile', data);
  },

  async getBadges(): Promise<Badge[]> {
    const result = await apiClient.get<any[]>('/user/badges');
    return result.map(item => item.badges);
  },
};
