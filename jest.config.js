module.exports = {
  preset: "ts-jest",
  testMatch: ["**/src/**/__tests__/**/*.test.ts"],
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/src/example/**/*",
    "!**/src/index.ts",
  ],
};
