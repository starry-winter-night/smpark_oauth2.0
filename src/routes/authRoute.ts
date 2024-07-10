import { Router } from 'express';

import { container } from '@configs/inversify';
import AuthenticationController from '@controllers/AuthenticationController';
import authBlockMiddleware from '@middleware/routeMiddleware/authBlockMiddleware';

const authenticationController = container.get<AuthenticationController>(
  AuthenticationController,
);

const auth = Router();

auth.get(
  '/register',
  authBlockMiddleware,
  authenticationController.renderRegisterPage.bind(authenticationController),
);

auth.post(
  '/register',
  authBlockMiddleware,
  authenticationController.userRegister.bind(authenticationController),
);

auth.get(
  '/login',
  authBlockMiddleware,
  authenticationController.renderLoginPage.bind(authenticationController),
);

auth.post(
  '/login',
  authBlockMiddleware,
  authenticationController.userLogin.bind(authenticationController),
);

auth.post(
  '/logout',
  authenticationController.userLogout.bind(authenticationController),
);

export default auth;
