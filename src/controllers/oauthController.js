const Member = require('../models/member');
const Oauth = require('../models/oauth');
const { xssCheck } = require('../services/oauth/security');
const {
  createCode,
  createRedirect,
  createExpiresIn,
  createLoginToken,
  createAccessToken,
  createRefreshToken,
  jwtVerify,
} = require('../services/oauth/token');
const { serialize } = require('../services/oauth/utils');
const { createVerifyRule, OAUTH_STATES } = require('../services/oauth/validation');
const createError = require('http-errors');

// app 페이지
const regAppView = async (req, res, next) => {
  try {
    const user = res.locals.user;
    const oauth = await Oauth.findByUsername(user.username);

    if (!oauth) {
      return next(createError(404, 'OAuth client가 존재하지 않음'));
    }

    return res.render('oauth/register', {
      client: oauth.client,
    });
  } catch (e) {
    return next(e);
  }
};

// app 등록
const regApp = async (req, res, next) => {
  const user = res.locals.user;
  const regData = req.body;

  // 파라미터 유효성 검증
  const updatedRegData = {
    ...regData,
    reqInfo: JSON.parse(regData.reqInfo),
    chatManagerList: JSON.parse(regData.chatManagerList),
    grants: ['authorization_code', 'refresh_token'], //아직 사용하진 않지만 추후 업데이트를 통해 사용할 수 있으므로 일단 저장
  };

  const schema = createVerifyRule(OAUTH_STATES.REGAPP_POST);
  const { error, value } = schema.validate(updatedRegData);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

  try {
    const oauth = await Oauth.findByUsername(user.username);

    if (!oauth) {
      return next(createError(404, 'OAuth 정보를 찾을 수 없습니다.'));
    }

    await oauth.updateByRegAppData(value);

    return res.status(200).send({ message: 'OAuth 등록 완료' });
  } catch (e) {
    return next(e);
  }
};
/***************** client용 로그인 페이지 뷰  *******************/
const validateOAuthRequest = async (req, res, next) => {
  const { client_id, redirect_uri, state } = req.query;
  const validata = { client_id: client_id, redirect_uri: redirect_uri, state };
  // 파라미터 유효성 검증
  const schema = createVerifyRule(OAUTH_STATES.AUTHORIZE_GET);

  const { error, value } = schema.validate(validata);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

  try {
    // client_id db 검색
    const oauth = await Oauth.findByClientId(value.client_id);

    if (!oauth) {
      return next(createError(404, '등록되지 않은 client_id.'));
    }

    const user = res.locals.user;

    if (!user) {
      return res.render(`oauth/login`, {
        client_id: value.client_id,
        redirect_uri: value.redirect_uri,
        state: value.state,
      });
    }

    const member = await Member.findByUsername(user.username);

    if (!member) {
      return next(createError(404, '가입되지 않은 유저입니다.'));
    }

    if (!member.agree) {
      const reqInfoObject = oauth.client.reqInfo.toObject(); // Mongoose 문서 객체를 일반 객체로 변환
      const reqInfoArray = Object.keys(reqInfoObject)
        .map((key) => ({
          key,
          value: reqInfoObject[key],
        }))
        .filter((item) => item.value); // value가 true인 항목만 포함

      return res.render(`oauth/agreement`, {
        client_id: value.client_id,
        redirect_uri: value.redirect_uri,
        state: value.state,
        reqInfo: reqInfoArray,
      });
    }

    // authorization code를 생성한다.
    const authorization_code = createCode();
    // 코드 유효시간
    const expiresIn = 10 * 60 * 1000; // 10분
    const expiresAt = Date.now() + expiresIn;
    // db 업데이트
    await oauth.updateByAuthCode(authorization_code, expiresAt, value.redirect_uri, user.username);
    // 리다이렉트 생성 후 전달

    return res.redirect(createRedirect(value.redirect_uri, authorization_code, value.state));
  } catch (e) {
    return next(e);
  }
};
/***************** 로그인 진행  *******************/
const oAuthLogin = async (req, res, next) => {
  console.log(req.body);
  const validata = {
    client_id: req.body.client_id,
    redirect_uri: req.body.redirect_uri,
    state: req.body.state,
    username: req.body.username,
    password: req.body.password,
    referer: req.cookies.referer,
  };

  //유효성 검사
  const schema = createVerifyRule(OAUTH_STATES.AUTHORIZE_POST);
  const { error, value } = schema.validate(validata);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

  // xss 검증
  const isXssValid = xssCheck(value.referer);
  if (!isXssValid) {
    return next(createError(403, '잠재적인 XSS 공격 감지'));
  }

  try {
    const member = await Member.findByUsername(value.username);

    // db에서 가입여부 확인
    if (!member) {
      return next(createError(401, '아이디 혹은 비밀번호가 일치하지 않습니다.'));
    }

    // db에서 비밀번호 일치 여부 확인
    const valid = await member.checkPassword(value.password);
    if (!valid) {
      return next(createError(401, '아이디 혹은 비밀번호가 일치하지 않습니다.'));
    }

    // 파라미처 client_id와 로그인 시도 client_id 비교
    if (value.client_id !== member.client.client_id) {
      return next(createError(401, '등록한 client_id와 로그인 유저의 client_id가 일치하지 않음.'));
    }
    // 로그인 토큰 생성
    const minutes = 60; // 1시간
    const token = createLoginToken({
      id: member._id,
      username: member.username,
      expiresIn: createExpiresIn('minute', minutes),
    });

    // 로그인 성공 cookie에 token 세팅
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });

    req.body = serialize(value);
    return res.status(200).send({
      redirect: `/oauth/authorize?client_id=${value.client_id}&redirect_uri=${value.redirect_uri}&state=${value.state}`,
    });
    // return res.redirect(
    //   `/oauth/authorize?client_id=${value.client_id}&redirect_uri=${value.redirect_uri}&state=${value.state}`
    // );
  } catch (e) {
    return next(e);
  }
};

const saveAgreement = async (req, res, next) => {
  let reqInfoArrayParsed = [];

  try {
    reqInfoArrayParsed = JSON.parse(req.body.reqInfo);
  } catch (error) {
    return next(createError(400, '잘못된 Array 형식.'));
  }

  // reqInfoArrayParsed 배열을 다시 객체로 변환
  const reqInfoObject = reqInfoArrayParsed.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  const validata = {
    client_id: req.body.client_id,
    redirect_uri: req.body.redirect_uri,
    state: req.body.state,
    reqInfo: reqInfoObject,
  };

  const schema = createVerifyRule(OAUTH_STATES.AGREEMENT_POST);
  const { error, value } = schema.validate(validata);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

  const updatedAgree = await Member.updateByAgree(value.client_id, true);

  if (!updatedAgree) {
    return next(createError(404, '유저 정보를 찾을 수 없습니다.'));
  }

  return res.redirect(
    `/oauth/authorize?client_id=${value.client_id}&redirect_uri=${value.redirect_uri}&state=${value.state}`
  );
};

const createTokens = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return next(createError(401, 'Invalid client credentials'));
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [client_id, client_secret] = credentials.split(':');
  const { code, redirect_uri, refresh_token, grant_type } = req.body;

  // 객체로 결합
  const tokenData = {
    grant_type,
    code,
    redirect_uri,
    client_id,
    client_secret,
    refresh_token,
  };

  const schema = createVerifyRule(OAUTH_STATES.TOKEN_POST);
  const { error, value } = schema.validate(tokenData);
  if (error) {
    return next(createError(400, error.details[0].message));
  }

  try {
    const oauth = await Oauth.findByAuthorizationCode(value.code, value.client_id);

    if (!oauth) {
      return next(createError(404, '등록되지 않은 code 또는 client_id.'));
    }

    // 코드의 만료 시간을 확인.
    if (Date.now() > oauth.authorization_code.expiresAt) {
      return next(createError(410, 'code 유효 기간 만료.'));
    }

    // 접속 토큰 발행 시
    if (grant_type === 'authorization_code') {
      // access token 생성
      const access_token = createAccessToken({
        sub: oauth._id,
        name: oauth.client.username,
        aud: value.client_id,
        expiresIn: createExpiresIn('hour', 1),
      });

      return res.json({
        access_token,
        token_type: 'Bearer',
        expires_in: 3600, // 1시간
        refresh_token: '',
      });

      // 재발급 토큰 발행 시
    } else if (grant_type === 'refresh_token') {
      // 토큰 decode 하기
      const jwtResult = await jwtVerify(grant_type, refresh_token);
      if (!jwtResult) {
        const error = {
          code: 401,
          message: 'function token jwt 토큰 decode 에러',
          clientMessage: `유효한 token 정보가 아닙니다.`,
        };
        return error;
      }

      // decode 값과 파라미터 값이 같으면
      if (jwtResult.id == client_id && jwtResult.secret == client_secret) {
        const oauth = await Oauth.findByUsername(decoded.user);
        // 접속 토큰 10분
        const acsTknTime = 10;
        // 만료시간 구하기
        const acsTknExpiresAt = createExpiresIn('minute', acsTknTime);
        const refTknExpiresAt = createExpiresIn('hour', 5);

        // refresh token 생성
        const refresh_token = createRefreshToken({
          id: client_id,
          user: username,
          iat: tokenIssuedAt,
          expiresIn: refTknExpiresAt,
        });
        // client에게 보낼 토큰 객체
        const token = {
          access_token: access_token,
          acsTknExpiresAt: acsTknExpiresAt,
        };
        // db 업데이트
        await oauth.updateOne({ token: token });
        // json 문자열로 변환

        return token;
      } else {
        const error = {
          code: 401,
          message: 'function token 토큰과 파라미터가 불일치',
          clientMessage: `토큰 정보와 파라미터 정보가 일치하지 않습니다.`,
        };
        return error;
      }
    }

    req.body = serialize(value);
    res.clearCookie('referer');
    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  regAppView,
  regApp,
  validateOAuthRequest,
  oAuthLogin,
  createTokens,
  saveAgreement,
};
