module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  roots: ['<rootDir>'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
};
