const Member = require('../models/member');
const Oauth = require('../models/oauth');
const mongoose = require('../configs/mongoose');
const { createVerifyRule, AUTH_STATES } = require('../services/auth/validation');
const { createExpiresIn, createLoginToken } = require('../services/auth/token');
const { serialize } = require('../services/auth/utils');
const createError = require('http-errors');

const userRegister = async (req, res, next) => {
  // Joi 파라미터 검증 규칙 생성
  const schema = createVerifyRule(AUTH_STATES.SIGN_UP);
  //Joi 파라미터 검증 실행
  const { error, value } = schema.validate(req.body);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

  const { username, password, email, name } = value;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 유저 가입 여부 db 탐색
    const exists = await Member.findByUsername(username).session(session);

    if (exists) {
      return next(createError(409, '이미 존재하는 아이디입니다.'));
    }

    const member = new Member({
      username,
      email,
      name,
      agree: false,
    });

    // 설정 메서드 호출
    await member.setClientId();
    await member.setClientSecret();
    await member.setChatApiKey();
    await member.setPassword(password);

    // db 저장
    await member.save({ session });

    const oauth = new Oauth({
      client: {
        username,
        client_id: member.client.client_id,
        client_secret: member.client.client_secret,
        chatApiKey: member.client.chatApiKey,
        reqInfo: { id: true, email: false, name: false },
      },
    });

    await oauth.save({ session });

    // 트랜젝션 커밋
    await session.commitTransaction();
    session.endSession();

    // 민감한 정보 삭제
    req.body = serialize(value);
    return res.status(201).send({ message: '유저 등록 성공', redirect: '/login' });
  } catch (e) {
    await session.abortTransaction();
    session.endSession();
    return next(e);
  }
};

const userLogin = async (req, res, next) => {
  // 파라미터 검증 규칙
  const schema = createVerifyRule(AUTH_STATES.SIGN_IN);

  // 파라미터 검증
  const { error, value } = schema.validate(req.body);

  if (error) {
    return next(createError(400, error.details[0].message));
  }

  const { username, password } = value;

  try {
    const member = await Member.findByUsername(username);

    // db에서 가입여부 확인
    if (!member) {
      return next(createError(401, '아이디 혹은 비밀번호가 일치하지 않습니다.'));
    }

    // db에서 비밀번호 일치 여부 확인
    const valid = await member.checkPassword(password);

    if (!member || !valid) {
      return next(createError(401, '아이디 혹은 비밀번호가 일치하지 않습니다.'));
    }

    // 로그인 토큰 생성
    const token = createLoginToken({
      id: member._id,
      username: member.username,
      expiresIn: createExpiresIn('day', 1),
    });
    // 로그인 성공 cookie에 token 세팅
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });

    // 민감한 정보 삭제
    req.body = serialize(value);
    return res.status(200).send({ message: '로그인 성공', redirect: '/oauth/regapp' });
  } catch (e) {
    return next(e);
  }
};

const userLogout = (req, res, next) => {
  res.clearCookie('access_token', {
    httpOnly: true, // XSS 방지 (클라이언트 쿠키 접근 금지)
    secure: true, // HTTPS 전용
    sameSite: 'Strict', // CSRF 보호 (같은 사이트에서만 쿠키전송)
  });
  return res.redirect('/');
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
