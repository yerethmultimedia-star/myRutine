import AsyncStorage from '@react-native-async-storage/async-storage';
import { tasksService } from './tasks';
import { routinesService } from './routines';
import { Task, Routine } from '../types';
import NetInfo from '@react-native-community/netinfo';

const SYNC_KEY = '@myrutine:sync_queue';

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'routine';
  data: any;
  timestamp: number;
}

class SyncManager {
  private isOnline: boolean = true;

  constructor() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected === true;
      if (this.isOnline) {
        this.processSyncQueue();
      }
    });
  }

  async addToSyncQueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>): Promise<void> {
    const queue = await this.getSyncQueue();
    const newOperation: SyncOperation = {
      ...operation,
      id: `sync_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };

    queue.push(newOperation);
    await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(queue));

    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  async getSyncQueue(): Promise<SyncOperation[]> {
    const data = await AsyncStorage.getItem(SYNC_KEY);
    return data ? JSON.parse(data) : [];
  }

  async clearSyncQueue(): Promise<void> {
    await AsyncStorage.removeItem(SYNC_KEY);
  }

  async processSyncQueue(): Promise<void> {
    if (!this.isOnline) return;

    const queue = await this.getSyncQueue();
    if (queue.length === 0) return;

    const processed: string[] = [];

    for (const operation of queue) {
      try {
        await this.processOperation(operation);
        processed.push(operation.id);
      } catch (error) {
        console.error('Sync operation failed:', operation, error);
        // Keep failed operations for retry
      }
    }

    // Remove processed operations
    const remaining = queue.filter(op => !processed.includes(op.id));
    await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(remaining));
  }

  private async processOperation(operation: SyncOperation): Promise<void> {
    switch (operation.entity) {
      case 'task':
        await this.syncTask(operation);
        break;
      case 'routine':
        await this.syncRoutine(operation);
        break;
    }
  }

  private async syncTask(operation: SyncOperation): Promise<void> {
    switch (operation.type) {
      case 'create':
        await tasksService.create(operation.data);
        break;
      case 'update':
        await tasksService.update(operation.data.id, operation.data);
        break;
      case 'delete':
        await tasksService.delete(operation.data.id);
        break;
    }
  }

  private async syncRoutine(operation: SyncOperation): Promise<void> {
    switch (operation.type) {
      case 'create':
        await routinesService.create(operation.data);
        break;
      case 'update':
        await routinesService.update(operation.data.id, operation.data);
        break;
      case 'delete':
        await routinesService.delete(operation.data.id);
        break;
    }
  }

  async saveLocal(entity: 'task' | 'routine', data: any): Promise<void> {
    const key = `@myrutine:local_${entity}:${data.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }

  async getLocal(entity: 'task' | 'routine', id: string): Promise<any | null> {
    const key = `@myrutine:local_${entity}:${id}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async getAllLocal(entity: 'task' | 'routine'): Promise<any[]> {
    const keys = await AsyncStorage.getAllKeys();
    const entityKeys = keys.filter(key => key.startsWith(`@myrutine:local_${entity}:`));
    const items = await AsyncStorage.multiGet(entityKeys);
    return items.map(([_, value]) => (value ? JSON.parse(value) : null)).filter(Boolean);
  }
}

export const syncManager = new SyncManager();
