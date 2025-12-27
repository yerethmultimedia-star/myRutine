import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getProgressMetrics } from '../services/progress';

const router = Router();
router.use(authenticate);

// Get progress metrics
router.get('/', async (req: AuthRequest, res) => {
  try {
    const metrics = await getProgressMetrics(req.user!.id);
    res.json(metrics);
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
