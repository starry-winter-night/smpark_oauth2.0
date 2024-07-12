import 'date-utils';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { TransformableInfo } from '@lib/winston-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDir = path.join(__dirname, '/../log');
const logLevel = 'info';
const { combine, timestamp, printf, colorize, simple } = winston.format;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 로그 포맷 정의
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(
    (info: TransformableInfo) =>
      `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// info 레벨 파일 트랜스포트
const infoTransport = new winston.transports.DailyRotateFile({
  filename: 'info-%DATE%.log',
  dirname: logDir,
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '180d',
});

// error 레벨 파일 트랜스포트
const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  dirname: logDir,
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '180d',
});

// 콘솔 트랜스포트 (개발 중에 유용)
const consoleTransport = new winston.transports.Console({
  format: combine(colorize(), simple()),
  level: logLevel,
});

const logger = winston.createLogger({
  format: logFormat,
  transports: [infoTransport, errorTransport, consoleTransport],
});

const stream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

export { logger, stream };
