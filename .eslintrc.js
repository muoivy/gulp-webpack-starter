module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12, // Sử dụng phiên bản ECMAScript mới nhất
    sourceType: 'module', // Cho phép sử dụng import/export
  },
  rules: {
    // Thêm quy tắc tùy chỉnh tại đây
  },
};
