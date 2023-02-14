import express from 'express';
import { loginRouter } from './login_router';
import { registerRouter } from './register_router';
import { forgotPasswordRouter } from './forgot_password_router';
import { userRouter } from './user_router';
import { usersManagementRouter } from './users_management_router';
import { courseRouter } from './course_router';

const router = express.Router();

const routes = () => {
  loginRouter(router);
  registerRouter(router);
  forgotPasswordRouter(router);
  userRouter(router);
  usersManagementRouter(router);
  courseRouter(router);

  return router;
};

export default routes;
