import { ERROR_MESSAGES } from '@constants/errorMessages';
import rateLimit from 'express-rate-limit';

// 1분을 밀리초로 변환한 값 (60,000 밀리초)
const rateLimitWindowMs = 1 * 60 * 1000;

// 제한 시간 동안 각 IP에서 허용되는 최대 요청 수
const maxRequestsPerWindow = 50;

// API 접속 시마다 IP의 트래픽을 검사하여 1분에 50회를 넘으면 접속 제한 (1분)
const rateLimiterMiddleware = rateLimit({
  windowMs: rateLimitWindowMs,
  max: maxRequestsPerWindow,
  headers: true,
  message: ERROR_MESSAGES.RATE_LIMIT.EXCEEDED,
});

export default rateLimiterMiddleware;
