import type { Config } from '@jest/types';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig: Config.InitialOptions = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    '^d3-array$': '<rootDir>/node_modules/d3-array/dist/d3-array.min.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^aws-exports$': '<rootDir>/__mocks__/aws-exports.js',
    // '^aws-amplify$': '<rootDir>/src/__mocks__/aws-amplify.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(d3-dsv|d3|d3-array|d3-scale|d3-shape|internmap|delaunator|robust-predicates)/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

export default createJestConfig(customJestConfig);
