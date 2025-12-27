import { Router } from 'express';
import { supabase } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// Get all routines for user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching routines:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single routine
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('routines')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching routine:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create routine
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, description, objective, duration_days, frequency } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
      .from('routines')
      .insert({
        user_id: req.user!.id,
        name,
        description,
        objective,
        duration_days,
        frequency,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating routine:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update routine
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, objective, duration_days, frequency, is_active } = req.body;

    // Verify ownership
    const { data: existing } = await supabase
      .from('routines')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    const { data, error } = await supabase
      .from('routines')
      .update({
        name,
        description,
        objective,
        duration_days,
        frequency,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Error updating routine:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete routine
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const { data: existing } = await supabase
      .from('routines')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    // Delete associated tasks first (CASCADE should handle this, but being explicit)
    await supabase
      .from('tasks')
      .delete()
      .eq('routine_id', id);

    const { error } = await supabase
      .from('routines')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Routine deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting routine:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
