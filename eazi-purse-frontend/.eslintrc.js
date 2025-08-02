module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
  },
  globals: {
    process: 'readonly',
    module: 'readonly',
    import: 'readonly',
    exports: 'readonly',
    require: 'readonly',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 