import { Router } from 'express';

import { container } from '@configs/inversify';
import authBlockMiddleware from '@middleware/routeMiddleware/authBlockMiddleware';
import type { IAuthenticationController } from '@adapters-interfaces/controllers/IAuthenticationController';

const authenticationController = container.get<IAuthenticationController>(
  'IAuthenticationController',
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
