const Joi = require('joi');
const jwt = require('jsonwebtoken');
const xss = require('xss');
const { v4: uuidv4 } = require('uuid');

const createVerifyRule = (state) => {
  if (state === 'regappPost') {
    const schema = Joi.object().keys({
      homepageAddr: Joi.string().required(),
      redirectUris: Joi.string().required(),
      appName: Joi.string(),
      reqInfo: Joi.object({
        아이디: Joi.string().optional().allow(null, ''),
        이메일: Joi.string().optional().allow(null, ''),
        이름: Joi.string().optional().allow(null, ''),
      })
        .optional()
        .allow(null, {}),
      chatManagerList: Joi.array().items(Joi.string().allow(null, '')),
      grants: Joi.array().items(Joi.string()).required(),
    });
    return schema;
  } else if (state === 'authorizeGet') {
    const schema = Joi.object().keys({
      clientId: Joi.string().required(),
      redirectUris: Joi.string().required(),
      state: Joi.string(),
    });
    return schema;
  } else if (state === 'authorizePost') {
    const schema = Joi.object().keys({
      clientId: Joi.string().required(),
      redirectUris: Joi.string().required(),
      state: Joi.string(),
      referer: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    return schema;
  } else if (state === 'callbackPost') {
    const schema = Joi.object().keys({
      clientId: Joi.string().required(),
      redirectUris: Joi.string().required(),
      state: Joi.string(),
      username: Joi.string().required(),
    });
    return schema;
  } else if (state === 'tokenPost') {
    const schema = Joi.object().keys({
      client_id: Joi.string().required(),
      redirect_uri: Joi.string(),
      clientSecret: Joi.string().required(),
      grant_type: Joi.string().required(),
      code: Joi.string().required(),
      refreshToken: Joi.string(),
    });
    return schema;
  }
};

const referrerCheck = (referer, hpAddr) => {
  // 홈페이지 주소 '/'제거.
  const refererLastStr = referer.charAt(referer.length - 1);
  const hpAddrLastStr = hpAddr.charAt(hpAddr.length - 1);

  if (refererLastStr == '/') {
    referer = referer.slice(0, -1);
  }
  if (hpAddrLastStr == '/') {
    hpAddr = hpAddr.slice(0, -1);
  }
  if (referer != hpAddr) {
    return false;
  } else {
    return true;
  }
};

const xssCheck = (referer, originUri) => {
  // originUri값이 있을 경우만
  if (originUri !== undefined) {
    // 전체 uri 구하기
    referer = referer + originUri;
  }

  // script uri escape
  const refererCheck = xss(referer);

  // xss 검사
  if (referer != refererCheck) {
    return false;
  }
  return true;
};

const redirectCheck = (redirectUri, redirect_uri) => {
  //등록된 uri와 query로 넘어몬 uri를 비교 검증한다.
  if (redirectUri != redirect_uri) {
    return false;
  }
  return true;
};

const createCode = () => {
  let hash = uuidv4();
  return hash.substring(1, 10);
};

const createRedirect = (uri, code, state) => {
  const result = `${uri}?code=${code}&state=${state}`;

  return result;
};

const createExpiresAt = (type, time) => {
  if (type === 'minute') {
    const expiresAt = Date.now() + 3600000 * 9 + 60 * time * 1000;
    return expiresAt;
  } else if (type === 'hour') {
    const expiresAt = Date.now() + 3600000 * 9 + 60 * time * 60000;
    return expiresAt;
  } else if (type === 'day') {
    const expiresAt = Date.now() + 3600000 * 9 + 60 * time * 60000 * 24;
    return expiresAt;
  } else {
    time = 'TypeError';
    return time;
  }
};

// 로그인 토큰 생성 함수
const createLoginToken = ({ id, username, expiresIn }) => {
  const token = jwt.sign(
    {
      _id: id,
      username: username,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: expiresIn,
    }
  );
  return token;
};

// 로그인 토큰 생성 함수
const createAccessToken = ({ id, secret, user, expiresIn }) => {
  const token = jwt.sign(
    {
      id,
      secret,
      user,
    },
    process.env.SMPARK_JWT_ACCESS_SECRET_KEY,
    {
      expiresIn,
    }
  );
  return token;
};

// 로그인 토큰 생성 함수
const createRefreshToken = ({ id, secret, user, expiresIn }) => {
  const token = jwt.sign(
    {
      id,
      secret,
      user,
    },
    process.env.SMPARK_JWT_REFRESH_SECRET_KEY,
    {
      expiresIn,
    }
  );
  return token;
};

const jwtVerify = async (type, token) => {
  let key = '';
  if (type === 'access_token') {
    key = process.env.SMPARK_JWT_ACCESS_SECRET_KEY;
  } else if (type === 'refresh_token') {
    key = process.env.SMPARK_JWT_REFRESH_SECRET_KEY;
  }
  const data = jwt.verify(token, key, async (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });
  return data;
};

const expiresTimeComparison = async (expiresAt) => {
  const now = Date.now() + 3600000 * 9;
  if (expiresAt < now) {
    return false;
  }
  return true;
};

const serialize = (body) => {
  delete body.clientSecret;
  delete body.password;
  delete body.code;
  return body;
};

const replaceManagerListArr = (list) => {
  let strWord = '';

  list.map((word, i) => {
    if (i === 0) {
      strWord = strWord + word;
    } else {
      strWord = strWord + `, ${word}`; // 띄어쓰기 유지
    }
  });
  return strWord;
};

module.exports = {
  createVerifyRule,
  referrerCheck,
  xssCheck,
  redirectCheck,
  createCode,
  createRedirect,
  createExpiresAt,
  createLoginToken,
  expiresTimeComparison,
  createAccessToken,
  createRefreshToken,
  replaceManagerListArr,
  jwtVerify,
  serialize,
};
