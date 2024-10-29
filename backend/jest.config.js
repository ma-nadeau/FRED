module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    roots: ['<rootDir>/src', '<rootDir>/libs', '<rootDir>/test'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@fred/repositories(|/.*)$': '<rootDir>/libs/repositories/src/$1',
      '^@fred/transfer-objects(|/.*)$': '<rootDir>/libs/transfer-objects/src/$1',
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
  };
  