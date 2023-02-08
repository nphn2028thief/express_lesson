import { Router } from 'express';
import { verifyToken, verifyAdminToken } from '../middleware/auth';

export const roleRouter = (router: Router) => {
  router.get('/tasks', (req, res) => {
    res.send('All Task!');
  });

  router.get('/users', verifyToken, verifyAdminToken, (req, res) => {
    res.send('User List');
  });
};
