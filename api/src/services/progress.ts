import { supabase } from '../index';
import { TaskDifficulty, ProgressMetrics, Streak } from '../types';

// XP values for difficulty levels
const XP_BASE = 10;
const XP_MULTIPLIER: Record<TaskDifficulty, number> = {
  1: 1,    // EASY
  2: 1.5,  // MEDIUM
  3: 2,    // HARD
  4: 3,    // VERY_HARD
  5: 5     // EXTREME
};

export function calculateXP(difficulty: TaskDifficulty): number {
  return Math.round(XP_BASE * XP_MULTIPLIER[difficulty]);
}

export function calculateLevel(totalXP: number): number {
  // Exponential leveling: each level requires more XP
  // Level 1: 100 XP, Level 2: 250 XP, Level 3: 500 XP, etc.
  let level = 1;
  let xpRequired = 0;
  
  while (xpRequired < totalXP) {
    level++;
    xpRequired += level * 100;
  }
  
  return Math.max(1, level - 1);
}

export function getXPForNextLevel(currentLevel: number): number {
  return (currentLevel + 1) * 100;
}

export async function updateUserProgress(
  userId: string,
  xpEarned: number
): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('total_xp')
    .eq('id', userId)
    .single();

  if (!user) return;

  const newTotalXP = user.total_xp + xpEarned;
  const newLevel = calculateLevel(newTotalXP);

  await supabase
    .from('users')
    .update({
      total_xp: newTotalXP,
      level: newLevel,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
}

export async function updateStreak(
  userId: string,
  routineId?: string
): Promise<Streak | null> {
  const today = new Date().toISOString().split('T')[0];
  
  let query = supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId);
  
  if (routineId) {
    query = query.eq('routine_id', routineId);
  } else {
    query = query.is('routine_id', null);
  }
  
  const { data: existingStreak } = await query.single();
  
  if (existingStreak) {
    const lastActivity = new Date(existingStreak.last_activity_date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = existingStreak.current_streak;
    
    // If last activity was yesterday, increment streak
    if (lastActivity.toDateString() === yesterday.toDateString()) {
      newStreak++;
    } 
    // If last activity was today, keep streak
    else if (lastActivity.toDateString() !== new Date().toDateString()) {
      newStreak = 1; // Reset streak
    }
    
    const longestStreak = Math.max(newStreak, existingStreak.longest_streak);
    
    const { data: updatedStreak } = await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_activity_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingStreak.id)
      .select()
      .single();
    
    return updatedStreak;
  } else {
    // Create new streak
    const { data: newStreak } = await supabase
      .from('streaks')
      .insert({
        user_id: userId,
        routine_id: routineId || null,
        current_streak: 1,
        longest_streak: 1,
        last_activity_date: today
      })
      .select()
      .single();
    
    return newStreak;
  }
}

export async function getProgressMetrics(
  userId: string
): Promise<ProgressMetrics> {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  
  // Get user info
  const { data: user } = await supabase
    .from('users')
    .select('level, total_xp')
    .eq('id', userId)
    .single();
  
  // Get daily completions
  const { data: dailyCompletions } = await supabase
    .from('task_completions')
    .select('xp_earned, created_at')
    .eq('user_id', userId)
    .gte('created_at', startOfDay);
  
  // Get weekly completions
  const { data: weeklyCompletions } = await supabase
    .from('task_completions')
    .select('xp_earned, created_at')
    .eq('user_id', userId)
    .gte('created_at', startOfWeek);
  
  // Get monthly completions
  const { data: monthlyCompletions } = await supabase
    .from('task_completions')
    .select('xp_earned, created_at')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth);
  
  // Get active tasks for totals
  const { data: activeTasks } = await supabase
    .from('tasks')
    .select('id')
    .eq('user_id', userId)
    .eq('is_paused', false);
  
  const totalTasks = activeTasks?.length || 0;
  
  const dailyXP = dailyCompletions?.reduce((sum, c) => sum + c.xp_earned, 0) || 0;
  const weeklyXP = weeklyCompletions?.reduce((sum, c) => sum + c.xp_earned, 0) || 0;
  const monthlyXP = monthlyCompletions?.reduce((sum, c) => sum + c.xp_earned, 0) || 0;
  
  // Get streaks
  const { data: streaks } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId);
  
  // Get badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('badge_id, badges(*)')
    .eq('user_id', userId);
  
  const level = user?.level || 1;
  const totalXP = user?.total_xp || 0;
  
  return {
    daily: {
      completed: dailyCompletions?.length || 0,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((dailyCompletions?.length || 0) / totalTasks * 100) : 0,
      xp_earned: dailyXP
    },
    weekly: {
      completed: weeklyCompletions?.length || 0,
      total: totalTasks * 7,
      percentage: totalTasks > 0 ? Math.round((weeklyCompletions?.length || 0) / (totalTasks * 7) * 100) : 0,
      xp_earned: weeklyXP
    },
    monthly: {
      completed: monthlyCompletions?.length || 0,
      total: totalTasks * 30,
      percentage: totalTasks > 0 ? Math.round((monthlyCompletions?.length || 0) / (totalTasks * 30) * 100) : 0,
      xp_earned: monthlyXP
    },
    streaks: streaks || [],
    level,
    total_xp: totalXP,
    xp_to_next_level: getXPForNextLevel(level) - totalXP,
    badges: userBadges?.map(ub => ub.badges) || []
  };
}
