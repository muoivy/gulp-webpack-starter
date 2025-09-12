import globals from 'globals';
import pluginJs from '@eslint/js';

export default {
  files: ['_scr/assets/js/**/*.js'], // Chỉ định các file JavaScript
  languageOptions: {
    globals: globals.browser,
  },
  plugins: {
    js: pluginJs,
  },
  extends: [
    pluginJs.configs.recommended, // Sử dụng quy tắc mặc định của ESLint
  ],
  rules: {
    // Thêm quy tắc tùy chỉnh tại đây
  },
};
