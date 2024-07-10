import { Container } from 'inversify';

import env from '@configs/env';
import MongoDB from '@database/MongoDB';

import AuthenticationService from '@services/AuthenticationService';
import OAuthRequestValidService from '@services/OAuthRequestValidService';
import ClientsService from '@services/ClientsService';
import CodeService from '@services/CodeService';
import OAuthVerifierService from '@services/OAuthVerifierService';
import TokenService from '@services/TokenService';

import AuthenticationController from '@controllers/AuthenticationController';
import ClientsController from '@controllers/ClientsController';
import OAuthController from '@controllers/OAuthController';

import TokenGenerationUseCase from '@usecases/token/TokenGenerationUseCase';
import ClientGenerationUseCase from '@usecases/clients/ClientGenerationUseCase';
import CodeGenerationUseCase from '@usecases/oauth/CodeGenerationUseCase';
import LoadOAuthDataUseCase from '@usecases/clients/ClientDetailsLoaderUseCase';
import RegisterOAuthDataUseCase from '@usecases/clients/ClientDetailsRegistrationUseCase';
import ScopeComparatorUseCase from '@usecases/oauth/ScopeComparatorUseCase';
import TokenPreparationUseCase from '@usecases/oauth/TokenPreparationUseCase';
import UserAuthorizationUseCase from '@usecases/oauth/UserAuthorizationUseCase';
import UserLoginUseCase from '@usecases/auth/UserLoginUseCase';
import UserRegistrationUseCase from '@usecases/auth/UserRegistrationUseCase';
import UserScopeUpdaterUseCase from '@usecases/oauth/UserScopeUpdaterUseCase';

import ClientsRepository from '@repository/ClientsRepository';
import CodeRepository from '@repository/CodeRepository';
import TokenRepository from '@repository/TokenRepository';
import UserRepository from '@repository/UserRepository';

import AuthenticationMiddleware from '@middleware/routeMiddleware/AuthenticationMiddleware';

import ClientsMapper from '@mapper/ClientsMapper';
import UserMapper from '@mapper/UserMapper';

const container = new Container();

const registerUseCaseDependencies = (): void => {
  container.bind(TokenGenerationUseCase).to(TokenGenerationUseCase);
  container.bind(ClientGenerationUseCase).to(ClientGenerationUseCase);
  container.bind(CodeGenerationUseCase).to(CodeGenerationUseCase);
  container.bind(LoadOAuthDataUseCase).to(LoadOAuthDataUseCase);
  container.bind(RegisterOAuthDataUseCase).to(RegisterOAuthDataUseCase);
  container.bind(ScopeComparatorUseCase).to(ScopeComparatorUseCase);
  container.bind(TokenPreparationUseCase).to(TokenPreparationUseCase);
  container.bind(UserAuthorizationUseCase).to(UserAuthorizationUseCase);
  container.bind(UserLoginUseCase).to(UserLoginUseCase);
  container.bind(UserRegistrationUseCase).to(UserRegistrationUseCase);
  container.bind(UserScopeUpdaterUseCase).to(UserScopeUpdaterUseCase);
};

const registerServiceDependencies = (): void => {
  container.bind(AuthenticationService).to(AuthenticationService);
  container.bind(OAuthRequestValidService).to(OAuthRequestValidService);
  container.bind(ClientsService).to(ClientsService);
  container.bind(CodeService).to(CodeService);
  container.bind(OAuthVerifierService).to(OAuthVerifierService);
  container.bind(TokenService).to(TokenService);
};

const registerRepositoryDependencies = (): void => {
  container.bind(ClientsRepository).to(ClientsRepository);
  container.bind(CodeRepository).to(CodeRepository);
  container.bind(TokenRepository).to(TokenRepository);
  container.bind(UserRepository).to(UserRepository);
};

const registerControllerDependencies = (): void => {
  container.bind(AuthenticationController).to(AuthenticationController);
  container.bind(ClientsController).to(ClientsController);
  container.bind(OAuthController).to(OAuthController);
};

const registerMongoDependencies = (dbURL: string, dbName: string): void => {
  container.bind('DbURL').toConstantValue(dbURL);
  container.bind('DbName').toConstantValue(dbName);
  container.bind(MongoDB).to(MongoDB).inSingletonScope();
};

const registerEnvDependencies = (): void => {
  container.bind('env').toConstantValue(env);
};

const registerMiddlewareDependencies = (): void => {
  container.bind(AuthenticationMiddleware).to(AuthenticationMiddleware);
};

const registerMapperDependencies = (): void => {
  container.bind(ClientsMapper).to(ClientsMapper);
  container.bind(UserMapper).to(UserMapper);
};

const registerAllDependencies = (dbURL: string, dbName: string): void => {
  registerControllerDependencies();
  registerEnvDependencies();
  registerMapperDependencies();
  registerMiddlewareDependencies();
  registerMongoDependencies(dbURL, dbName);
  registerRepositoryDependencies();
  registerServiceDependencies();
  registerUseCaseDependencies();
};

export { container, registerAllDependencies };
