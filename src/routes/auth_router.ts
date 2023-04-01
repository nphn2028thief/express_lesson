import { Router } from 'express';
import authController from '../app/controllers/auth_controller';
import { verifyRefreshToken, verifyToken } from '../middleware/auth';

const authRouter = (router: Router) => {
  router.post('/auth/register', authController.register);
  router.post('/auth/login', authController.login);
  router.get('/auth/me', verifyToken, authController.getMe);
  router.patch('/auth/updateMe', verifyToken, authController.updateMe);
  router.put('/auth/changePassword', verifyToken, authController.updatePassword);
  router.post('/auth/refreshToken', verifyRefreshToken, authController.refreshToken);
};

export default authRouter;
