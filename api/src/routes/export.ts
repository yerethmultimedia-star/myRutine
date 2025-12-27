import { Router } from 'express';
import { supabase } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Export user data as JSON
router.get('/json', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get all user data
    const [user, routines, tasks, completions, badges, streaks] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('routines').select('*').eq('user_id', userId),
      supabase.from('tasks').select('*').eq('user_id', userId),
      supabase.from('task_completions').select('*').eq('user_id', userId),
      supabase.from('user_badges').select('badge_id, earned_at, badges(*)').eq('user_id', userId),
      supabase.from('streaks').select('*').eq('user_id', userId)
    ]);

    const exportData = {
      user: user.data,
      routines: routines.data,
      tasks: tasks.data,
      completions: completions.data,
      badges: badges.data,
      streaks: streaks.data,
      exported_at: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=myrutine-export-${Date.now()}.json`);
    res.json(exportData);
  } catch (error: any) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export user data as CSV
router.get('/csv', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const { data: tasks } = await supabase
      .from('tasks')
      .select('*, routines(name)')
      .eq('user_id', userId);

    if (!tasks) {
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }

    // Convert to CSV
    const headers = ['ID', 'Name', 'Description', 'Routine', 'Priority', 'Difficulty', 'Status', 'Deadline', 'Created At'];
    const rows = tasks.map(task => [
      task.id,
      task.name,
      task.description || '',
      task.routines?.name || '',
      task.priority,
      task.difficulty,
      task.is_completed ? 'Completed' : task.is_paused ? 'Paused' : 'Active',
      task.deadline || '',
      task.created_at
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=myrutine-tasks-${Date.now()}.csv`);
    res.send(csv);
  } catch (error: any) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
