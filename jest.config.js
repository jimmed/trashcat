module.exports = {
  preset: "ts-jest",
  testMatch: ["**/src/**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/src/**/__tests__/fixtures.ts",
    "!**/src/**/__tests__/fixtures/**/*.ts",
    "!**/src/**/index.ts",
  ],
};
