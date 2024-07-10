export type EnvConfig = {
  nodeEnv: string;
  port: string;
  mongoDBUri: string;
  mongoDBUser: string;
  mongoDBName: string;
  mongoDBSessionCollection: string;
  mongoDBPassword: string;
  mongoDBSessionKey: string;
  oauthCodeExpiresIn: string;
  oauthAccessSecret: string;
  oauthRefreshSecret: string;
  oauthAccessTokenExpiresIn: string;
  oauthRefreshTokenExpiresIn: string;
  loginExpiresIn: string;
  loginJWTSecretKey: string;
  issuer: string;
};
