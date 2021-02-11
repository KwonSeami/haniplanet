module.exports = {
  roots: [
    "<rootDir>",
  ],
  testEnvironment: 'jest-environment-jsdom-fifteen',
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testMatch: [
    "**/*.(test|spec).(ts|tsx)"
  ],
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      babelConfig: true,
      tsConfig: "jest.tsconfig.json",
      diagnostics: false
    }
  },
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  collectCoverageFrom: ["**/*.{ts,tsx}"],
  setupFiles: ["jest-localstorage-mock"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "json-summary",
    "html"
  ]
};
