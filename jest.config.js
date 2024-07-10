import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
const fileUrl = new URL('./tsconfig.json', import.meta.url);
const { compilerOptions } = JSON.parse(readFileSync(fileUrl));

const config = {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testMatch: [
    '**/tests/unit/**/*.test.+(ts|tsx|js)',
    '**/tests/integration/**/*.test.+(ts|tsx|js)',
  ],
  roots: ['<rootDir>/src'],
  setupFiles: ['reflect-metadata'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
};

export default config;
