const jwt = require('jsonwebtoken');
const { createExpiresIn, createLoginToken } = require('../../services/auth/token');

// API 접속 시마다 로그인 토큰을 검사 후 만료기간에 따라 토큰 갱신
const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.locals.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    // UTC 기준 1970년 1월 1일 0시 0분 0초부터 현재까지 경과된 시간의 초 반환
    const now = Math.floor(Date.now() / 1000);

    // 토큰 만료일이 0.5일보다 조금 남는 경우
    if (decoded.exp - now < 60 * 60 * 12) {
      // 로그인 토큰 생성
      const newToken = createLoginToken({
        id: decoded._id,
        username: decoded.username,
        expiresIn: createExpiresIn('day', 1),
      });

      // 기존 토큰 삭제 후 새로운 토큰을 쿠키에 설정
      res.cookie('access_token', newToken, {
        maxAge: 1000 * 60 * 60 * 24, // 1일
        httpOnly: true,
      });
    }

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = jwtMiddleware;
