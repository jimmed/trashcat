module.exports = {
  preset: "ts-jest",
  testMatch: ["**/src/**/__tests__/**/*.test.ts", "!**/src/example/**/*"],
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/src/example/**/*",
    "!**/src/**/__tests__/fixtures.ts",
    "!**/src/**/__tests__/fixtures/**/*.ts",
    "!**/src/index.ts",
  ],
};
