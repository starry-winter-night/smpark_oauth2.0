const jwt = require('jsonwebtoken');

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

module.exports = {
  createExpiresIn,
  createLoginToken,
};
