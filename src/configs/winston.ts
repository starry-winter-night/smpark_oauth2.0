import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import env from '@configs/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDir = path.join(__dirname, '/../log');
const { combine, colorize, simple, printf } = winston.format;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 한국 시간 적용을 위한 함수
const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz)
    info.timestamp = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
  return info;
});

// 커스텀 로그 포맷
const customFormat = printf((info) => {
  return `${info.level.toUpperCase()}: ${info.timestamp} ${info.message}`;
});

// 필터 설정
const infoAndWarnFilter = winston.format((info) => {
  return info.level === 'info' || info.level === 'warn' ? info : false;
});

const errorFilter = winston.format((info) => {
  return info.level === 'error' ? info : false;
});

// info와 warn 레벨 파일 트랜스포트
const infoAndWarnTransport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  dirname: path.join(logDir, 'info'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '128m',
  maxFiles: '14d',
  level: 'info',
  format: combine(
    infoAndWarnFilter(),
    appendTimestamp({ tz: true }),
    customFormat,
  ),
});

// error 레벨 파일 트랜스포트
const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'application-%DATE%.log',
  dirname: path.join(logDir, 'error'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '128m',
  maxFiles: '14d',
  level: 'error',
  format: combine(errorFilter(), appendTimestamp({ tz: true }), customFormat),
});

// 콘솔 트랜스포트
const consoleTransport = new winston.transports.Console({
  level: env.nodeEnv === 'production' ? 'warn' : 'debug',
  format: combine(colorize(), appendTimestamp({ tz: true }), simple()),
});

const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  format: combine(appendTimestamp({ tz: true }), customFormat),
  transports: [infoAndWarnTransport, errorTransport, consoleTransport],
});

const stream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

export { logger, stream };
