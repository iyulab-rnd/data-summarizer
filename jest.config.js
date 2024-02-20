// jest.config.js
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const transform = {
  '^.+\\.tsx?$': 'babel-jest',
};