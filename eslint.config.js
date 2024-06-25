import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

import globals from 'globals';

export default [
  {
    ignores: ['**/*.mjs', '**/*.cjs', 'src/log/**', 'src/public/**'],
  },
  // JavaScript 설정
  {
    files: ['src/**/*.js'],
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser, // 전역 변수 처리
      },
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error', // Prettier 규칙 적용
      semi: 'error', // 세미콜론 강제
      eqeqeq: 'error', // 일치 연산자 사용 강제
      'prefer-const': 'error', // const 사용 권장
      curly: 'error', // 중괄호 사용 강제
      'no-console': 'warn', // console 사용 경고
      'no-trailing-spaces': 'error', // 불필요한 공백 제거
      'eol-last': ['error', 'always'], // 파일 끝에 newline 추가
      'no-multiple-empty-lines': ['error', { max: 1 }], // 여러 개의 빈 줄 금지
      'no-var': 'error', // var 사용 금지
      'no-undef': 'error', // 정의되지 않은 변수를 사용하지 않도록 함
      'no-unused-vars': 'warn', // 사용되지 않는 변수를 경고
      'prefer-arrow-callback': 'error', // 화살표 함수 사용 권장
      'arrow-spacing': ['error', { before: true, after: true }], // 화살표 함수의 화살표 앞뒤에 공백 추가
    },
  },
  // TypeScript 설정
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...prettierConfig.rules,
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_', // 변수
          argsIgnorePattern: '^_', // 함수
        },
      ], // 사용되지 않는 변수를 경고
      '@typescript-eslint/explicit-function-return-type': 'error', // 명시적인 함수 반환 타입 요구
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 경고
      '@typescript-eslint/no-inferrable-types': 'error', // 불필요한 타입 선언 금지
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }], // 배열 타입 정의
      '@typescript-eslint/no-non-null-assertion': 'error', // non-null assertion 금지
      '@typescript-eslint/explicit-module-boundary-types': 'warn', // 모듈 경계의 타입 명시 요구
      '@typescript-eslint/no-var-requires': 'error', // require 사용 금지
      '@typescript-eslint/prefer-namespace-keyword': 'error', // namespace 대신 module 사용 금지
      'no-restricted-imports': [
        // .를 통한 상대경로 임포트를 금지 시켜 alias 강제
        'error',
        {
          patterns: ['.*'],
        },
      ],
    },
  },
];
