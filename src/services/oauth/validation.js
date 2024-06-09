const Joi = require('joi');

// 상수 정의
const OAUTH_STATES = {
  REGAPP_POST: 'regappPost',
  AUTHORIZE_GET: 'authorizeGet',
  AUTHORIZE_POST: 'authorizePost',
  AGREEMENT_POST: 'agreement',
  TOKEN_POST: 'tokenPost',
};

// 스키마 정의
const schemas = {
  [OAUTH_STATES.REGAPP_POST]: Joi.object({
    homepageAddr: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    appName: Joi.string(),
    reqInfo: Joi.object({
      id: Joi.boolean().required(),
      email: Joi.boolean(),
      name: Joi.boolean(),
    }).required(),
    chatManagerList: Joi.array().items(Joi.string().allow(null, '')),
    grants: Joi.array().items(Joi.string()).required(),
  }),
  [OAUTH_STATES.AUTHORIZE_GET]: Joi.object({
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    state: Joi.string(),
  }),
  [OAUTH_STATES.AUTHORIZE_POST]: Joi.object({
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    state: Joi.string(),
    referer: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
  [OAUTH_STATES.AGREEMENT_POST]: Joi.object({
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    state: Joi.string(),
    reqInfo: Joi.object({
      id: Joi.boolean().required(),
      email: Joi.boolean(),
      name: Joi.boolean(),
    }).required(),
  }),
  [OAUTH_STATES.TOKEN_POST]: Joi.object({
    client_id: Joi.string().required(),
    redirect_uri: Joi.string(),
    client_secret: Joi.string().required(),
    grant_type: Joi.string().required(),
    code: Joi.string().required(),
    refresh_token: Joi.string(),
  }),
};

// 검증 규칙 생성 함수
const createVerifyRule = (state) => {
  return schemas[state];
};

module.exports = {
  createVerifyRule,
  OAUTH_STATES,
};
