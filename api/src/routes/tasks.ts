import { Router } from 'express';
import { supabase } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateXP, updateUserProgress, updateStreak } from '../services/progress';
import { TaskDifficulty } from '../types';

const router = Router();
router.use(authenticate);

// Get all tasks for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { routine_id, is_completed, is_paused } = req.query;

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user!.id);

    if (routine_id) {
      query = query.eq('routine_id', routine_id as string);
    }

    if (is_completed !== undefined) {
      query = query.eq('is_completed', is_completed === 'true');
    }

    if (is_paused !== undefined) {
      query = query.eq('is_paused', is_paused === 'true');
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single task
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      routine_id,
      name,
      description,
      priority,
      difficulty,
      deadline,
      repetition,
      repetition_config
    } = req.body;

    if (!name || !routine_id) {
      return res.status(400).json({ error: 'Name and routine_id are required' });
    }

    // Verify routine ownership
    const { data: routine } = await supabase
      .from('routines')
      .select('id')
      .eq('id', routine_id)
      .eq('user_id', req.user!.id)
      .single();

    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: req.user!.id,
        routine_id,
        name,
        description,
        priority: priority || 'medium',
        difficulty: difficulty || TaskDifficulty.MEDIUM,
        deadline,
        repetition: repetition || 'none',
        repetition_config: repetition_config ? JSON.stringify(repetition_config) : null,
        is_completed: false,
        is_paused: false
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      priority,
      difficulty,
      deadline,
      repetition,
      repetition_config,
      is_paused
    } = req.body;

    // Verify ownership
    const { data: existing } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (repetition !== undefined) updateData.repetition = repetition;
    if (repetition_config !== undefined) {
      updateData.repetition_config = repetition_config ? JSON.stringify(repetition_config) : null;
    }
    if (is_paused !== undefined) updateData.is_paused = is_paused;

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Complete task
router.post('/:id/complete', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership and get task
    const { data: task } = await supabase
      .from('tasks')
      .select('*, routines(id)')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.is_completed) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    const xpEarned = calculateXP(task.difficulty);
    const now = new Date().toISOString();

    // Update task
    const { data: updatedTask, error: taskError } = await supabase
      .from('tasks')
      .update({
        is_completed: true,
        completed_at: now,
        updated_at: now
      })
      .eq('id', id)
      .select()
      .single();

    if (taskError) throw taskError;

    // Create completion record
    await supabase
      .from('task_completions')
      .insert({
        task_id: id,
        user_id: req.user!.id,
        completed_at: now,
        xp_earned: xpEarned
      });

    // Update user progress
    await updateUserProgress(req.user!.id, xpEarned);

    // Update streak
    await updateStreak(req.user!.id, task.routine_id);

    res.json({ task: updatedTask, xp_earned: xpEarned });
  } catch (error: any) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Uncomplete task (for undoing)
router.post('/:id/uncomplete', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: task } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (!task.is_completed) {
      return res.status(400).json({ error: 'Task not completed' });
    }

    const xpEarned = calculateXP(task.difficulty);

    // Update task
    const { data: updatedTask, error: taskError } = await supabase
      .from('tasks')
      .update({
        is_completed: false,
        completed_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (taskError) throw taskError;

    // Remove latest completion record
    await supabase
      .from('task_completions')
      .delete()
      .eq('task_id', id)
      .eq('user_id', req.user!.id)
      .order('completed_at', { ascending: false })
      .limit(1);

    // Update user progress (subtract XP)
    await updateUserProgress(req.user!.id, -xpEarned);

    res.json(updatedTask);
  } catch (error: any) {
    console.error('Error uncompleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pause task
router.post('/:id/pause', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .update({ is_paused: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error pausing task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Resume task
router.post('/:id/resume', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .update({ is_paused: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error resuming task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: existing } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
