import { Request, Response, NextFunction } from 'express';

import { logger } from '@configs/winston';
import { ERROR_MESSAGES } from '@constants/errorMessages';

interface HttpError extends Error {
  status?: number;
}

const errorHandlerMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.status || 500;
  const errorMessage = err.message || ERROR_MESSAGES.SERVER.ISSUE;

  // 에러 로그 남기기
  logger.error(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - ${errorMessage}`,
  );

  // 특정 에러 상태 코드에 대한 처리
  if ([500, 501, 502, 503, 504].includes(statusCode)) {
    res.status(statusCode).render('main/error', {
      code: statusCode,
      message: ERROR_MESSAGES.SERVER.ISSUE,
    });
  } else if (statusCode === 404) {
    res.status(404).render('main/error', {
      code: 404,
      message: ERROR_MESSAGES.NOT_FOUND.PAGE,
    });
  } else {
    // 기타 에러는 JSON 응답
    res.status(statusCode).json({ message: errorMessage });
  }
};

export default errorHandlerMiddleware;
