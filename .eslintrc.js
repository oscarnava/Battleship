module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-shadow": 0,
    "no-param-reassign": 0,
    "eol-last": 0,
    "object-curly-newline": 0,
    "no-underscore-dangle": 0,
  },
  devDependencies: {
    "serialize-javascript": ">=2.1.1"
  }
};
