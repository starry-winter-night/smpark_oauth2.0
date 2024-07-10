import { execSync } from 'child_process';
import fs from 'fs-extra';

try {
  execSync('eslint . && tsc && tsc-alias --resolve-full-paths', {
    stdio: 'inherit',
  });
  
  fs.copySync('src/views', 'dist/views');
  fs.copySync('src/public', 'dist/public');
  fs.copySync('src/script', 'dist/script');

  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}