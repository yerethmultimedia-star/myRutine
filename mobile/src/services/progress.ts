import { apiClient } from './api';
import { ProgressMetrics } from '../types';

export const progressService = {
  async getMetrics(): Promise<ProgressMetrics> {
    return apiClient.get<ProgressMetrics>('/progress');
  },
};
