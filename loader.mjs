import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register the ts-node/esm loader
register('ts-node/esm', pathToFileURL('./'));

// 추가적으로 전역 에러 핸들러를 등록하여 자세한 오류 메시지를 출력
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
