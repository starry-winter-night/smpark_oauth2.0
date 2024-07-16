import { Router } from 'express';
import { container } from '@configs/inversify';
import ClientsController from '@controllers/ClientsController';
import AuthenticationMiddleware from '@middleware/routeMiddleware/AuthenticationMiddleware';
import OAuthController from '@controllers/OAuthController';
import dynamicCSPMiddleware from '@middleware/routeMiddleware/dynamicCSPMiddleware';

const oAuthController = container.get<OAuthController>(OAuthController);
const clientsController = container.get<ClientsController>(ClientsController);
const authenticationMiddleware = container.get<AuthenticationMiddleware>(
  AuthenticationMiddleware,
);

const oauth = Router();

oauth.get(
  '/register',
  authenticationMiddleware.handle,
  clientsController.renderClientRegistrationPage.bind(clientsController),
);

oauth.post(
  '/register',
  authenticationMiddleware.handle,
  clientsController.registerClientsDetail.bind(clientsController),
);

oauth.post(
  '/credential',
  authenticationMiddleware.handle,
  clientsController.generateCredentials.bind(clientsController),
);

oauth.get(
  '/authorize',
  authenticationMiddleware.handle,
  oAuthController.verifyOauthRequest.bind(oAuthController),
  dynamicCSPMiddleware,
  oAuthController.compareScope.bind(oAuthController),
);

oauth.post(
  '/authorize',
  oAuthController.verifyOauthRequest.bind(oAuthController),
  oAuthController.oAuthUserLogin.bind(oAuthController),
);

oauth.get(
  '/consent',
  authenticationMiddleware.handle,
  oAuthController.updateUserAgreedScope.bind(oAuthController),
  oAuthController.generateCode.bind(oAuthController),
);

oauth.post('/disagree', oAuthController.disagree.bind(oAuthController));

oauth.post(
  '/token',
  oAuthController.verifyTokenRequest.bind(oAuthController),
  oAuthController.generateAccessToken.bind(oAuthController),
);

export default oauth;
