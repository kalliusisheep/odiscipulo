module.exports = {
  rootDir: '..',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  moduleDirectories: ['node_modules', '<rootDir>/backend/node_modules'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
