import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';

// Lấy đường dẫn hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const webpackConfig = {
  entry: './_src/assets/js/index.js', // Điểm vào chính của ứng dụng
  output: {
    filename: 'bundle.js', // Tên file đầu ra sau khi bundle
    path: resolve(__dirname, 'dist'), // Thư mục đầu ra
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Áp dụng Babel cho các file .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: mode, // Hoặc 'development' tùy thuộc vào môi trường
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'mjs', 'cjs'],
      emitWarning: true, // Chỉ ra rằng lỗi lint không làm thất bại build
    }),
  ],
};

export default webpackConfig; // Xuất cấu hình Webpack
