export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskDifficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
  VERY_HARD = 4,
  EXTREME = 5
}

export enum TaskRepetition {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
  NONE = 'none'
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: UserRole;
  level: number;
  total_xp: number;
  created_at: string;
  updated_at: string;
}

export interface Routine {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  objective?: string;
  duration_days?: number;
  frequency?: string; // e.g., "daily", "3 times per week"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  routine_id: string;
  user_id: string;
  name: string;
  description?: string;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  deadline?: string;
  repetition: TaskRepetition;
  repetition_config?: string; // JSON for custom repetition
  is_completed: boolean;
  is_paused: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  user_id: string;
  completed_at: string;
  xp_earned: number;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string; // JSON condition
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  routine_id?: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressMetrics {
  daily: {
    completed: number;
    total: number;
    percentage: number;
    xp_earned: number;
  };
  weekly: {
    completed: number;
    total: number;
    percentage: number;
    xp_earned: number;
  };
  monthly: {
    completed: number;
    total: number;
    percentage: number;
    xp_earned: number;
  };
  streaks: Streak[];
  level: number;
  total_xp: number;
  xp_to_next_level: number;
  badges: Badge[];
}
