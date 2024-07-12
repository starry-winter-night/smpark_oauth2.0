import dotenv from 'dotenv';
import type { EnvConfig } from '@lib/dotenv-env';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV as string,
  port: process.env.APP_PORT as string,
  mongoDBUri: process.env.MONGO_DATABASE_URI as string,
  mongoDBSessionKey: process.env.MONGO_DATABASE_SESSION_KEY as string,
  mongoDBUser: process.env.MONGO_DATABASE_USER as string,
  mongoDBName: process.env.MONGO_DATABASE_NAME as string,
  mongoDBSessionCollection: process.env.MONGO_DATABASE_SESSION_COLLECTION as string,
  mongoDBPassword: process.env.MONGO_DATABASE_PASSWORD as string,
  oauthCodeExpiresIn: process.env.OAUTH_CODE_EXPIRES_IN as string,
  oauthAccessSecret: process.env.OAUTH_ACCESS_SECRET_KEY as string,
  oauthAccessTokenExpiresIn: process.env.OAUTH_ACCESS_TOKEN_EXPIRES_IN as string,
  oauthRefreshSecret: process.env.OAUTH_REFRESH_SECRET_KEY as string,
  oauthRefreshTokenExpiresIn: process.env.OAUTH_REFRESH_TOKEN_EXPIRES_IN as string,
  loginExpiresIn: process.env.LOGIN_EXPIRES_IN as string,
  loginJWTSecretKey: process.env.LOGIN_JWT_SECRET_KEY as string,
  issuer: process.env.OAUTH_ISSUER as string,
};

export default env;
