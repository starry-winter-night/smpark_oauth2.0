const { logger } = require('../../configs/winston');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // 에러 로그 남기기
  logger.error(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${message}`);

  // 특정 에러 상태 코드에 대한 처리
  if ([500, 501, 502, 503, 504].includes(status)) {
    res.status(status).render('main/error', {
      code: status,
      message: '서버에 문제가 발생했습니다. 나중에 다시 시도해주세요.',
    });
  } else if (status === 404) {
    res.status(404).render('main/error', {
      code: 404,
      message: '페이지를 찾을 수 없습니다.',
    });
  } else {
    // 기타 에러는 JSON 응답
    res.status(status).json({ message });
  }
};

module.exports = errorHandler;
