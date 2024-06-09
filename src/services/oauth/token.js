const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
// 로그인 토큰 생성 함수
const createLoginToken = ({ id, username, expiresIn }) => {
  const token = jwt.sign(
    {
      _id: id,
      username,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn,
    }
  );
  return token;
};

// 로그인 토큰 생성 함수
const createAccessToken = ({ sub, name, aud, expiresIn }) => {
  const token = jwt.sign(
    {
      sub,
      name,
      aud,
      iss: process.env.ISSUER_URL,
    },
    process.env.SMPARK_JWT_ACCESS_SECRET_KEY,
    {
      expiresIn,
    }
  );
  return token;
};

// 로그인 토큰 생성 함수
const createRefreshToken = ({ id, user, expiresIn }) => {
  const token = jwt.sign(
    {
      sub: user,
      name: user,
      aud: id,
      iss: process.env.ISSUER_URL,
    },
    process.env.SMPARK_JWT_REFRESH_SECRET_KEY,
    {
      expiresIn,
    }
  );
  return token;
};

const createExpiresIn = (type, time) => {
  let expiresIn;

  if (type === 'minute') {
    expiresIn = 60 * time;
  } else if (type === 'hour') {
    expiresIn = 60 * 60 * time;
  } else if (type === 'day') {
    expiresIn = 60 * 60 * 24 * time;
  } else {
    throw new Error('Invalid time type');
  }

  return expiresIn; // 초 단위 유효 기간 반환
};

const createCode = () => {
  let hash = uuidv4();
  return hash;
};

const createRedirect = (uri, code, state) => {
  const result = `${uri}?code=${code}&state=${state}`;

  return result;
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

module.exports = {
  createCode,
  createRedirect,
  createExpiresIn,
  createLoginToken,
  createAccessToken,
  createRefreshToken,
  jwtVerify,
};
