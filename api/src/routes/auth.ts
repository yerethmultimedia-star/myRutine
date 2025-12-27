import { Router } from 'express';
import { supabase } from '../index';

const router = Router();

// This endpoint is mainly for verification - actual auth happens client-side with Supabase
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Ensure user exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!existingUser) {
      // Create user record
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          role: 'user',
          level: 1,
          total_xp: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      return res.json({ user: newUser, token });
    }

    res.json({ user: existingUser, token });
  } catch (error) {
    console.error('Auth verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
