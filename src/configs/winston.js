const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');
require('date-utils');

const logDir = path.join(__dirname, '/../log');
const logLevel = 'info';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
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
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  level: logLevel,
});

const logger = winston.createLogger({
  format: logFormat,
  transports: [infoTransport, errorTransport, consoleTransport],
});

const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = { logger, stream };
