import express from 'express';
import { courseRouter } from './course_router';
import { loginRouter } from './login_router';
import { registerRouter } from './register_router';
import { roleRouter } from './role_router';

const router = express.Router();

const routes = () => {
  courseRouter(router);
  loginRouter(router);
  registerRouter(router);
  roleRouter(router);

  return router;
};

export default routes;
