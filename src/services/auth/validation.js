const Joi = require('joi');

const AUTH_STATES = {
  SIGN_UP: 'signUp',
  SIGN_IN: 'signIn',
};

// 스키마 정의
const schemas = {
  [AUTH_STATES.SIGN_UP]: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
  }),
  [AUTH_STATES.SIGN_IN]: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  }),
};

// 파라미터 검증 규칙 생성 함수
const createVerifyRule = (state) => {
  return schemas[state];
};

module.exports = {
  AUTH_STATES,
  createVerifyRule,
};
