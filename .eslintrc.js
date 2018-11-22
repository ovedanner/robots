module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'airbnb-base',
  ],
  plugins: [
    'ember'
  ],
  env: {
    browser: true
  },
  rules: {
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": 0,
    "func-names": 0,
    "no-plusplus": 0,
    "no-underscore-dangle": 0,
    "arrow-body-style": 0,
    "no-param-reassign": 0,
    "no-bitwise": 0,
    "operator-linebreak": 0,
    "space-before-function-paren": 0
  },
  overrides: [
    // node files
    {
      files: [
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
