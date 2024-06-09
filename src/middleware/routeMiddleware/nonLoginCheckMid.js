const { logger } = require('../../configs/winston');

// 로그인이 필요한 api 마다 해당 미들웨어 실행하여 로그인 검사
const nonLoginCheck = (req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    logger.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${"비로그인 접속 시도"}`);

    return res.render(__dirname + '/../views/main/index.pug');
  }

  return next();
};

module.exports = nonLoginCheck;
