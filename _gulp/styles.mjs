'use strict';

import gulp from 'gulp';
import { app, devBuild } from './_config.mjs';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import sassGlob from 'gulp-sass-glob';
import sourcemaps from 'gulp-sourcemaps';
import gulpSass from 'gulp-dart-sass';
import noop from 'gulp-noop';
import browserSync from 'browser-sync';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

//--------- Khởi tạo gulp-sass
const sass = gulpSass;

//--------- Danh sách các plugin PostCSS
const postCssPlugins = [
  autoprefixer({ overrideBrowserslist: ['last 2 versions', 'ie >= 11', 'Android >= 4'] }),
  cssnano() // Nén CSS
];

const styles = () => {
  return gulp.src(`${app.styles}/layout.scss`)
    .pipe(plumber({ errorHandler: notify.onError('Error on <gulp sass>: <%= error.message %>') }))
    .pipe(sassGlob()) // Kết hợp các file SCSS bằng glob
    .pipe(devBuild ? sourcemaps.init() : noop()) // Khởi tạo sourcemaps nếu đang trong môi trường phát triển
    .pipe(sass({
      includePaths: [app.styles], // Đường dẫn cho Sass include
      outputStyle: 'expanded', // Tùy chọn output style
      silenceDeprecations: ['legacy-js-api'], // Tắt cảnh báo Deprecation về API cũ
    }).on('error', sass.logError)) // Bắt lỗi từ Sass
    .pipe(postcss(postCssPlugins)) // Áp dụng các plugin PostCSS
    .pipe(devBuild ? sourcemaps.write('.') : noop()) // Viết sourcemaps nếu là devBuild
    .pipe(gulp.dest(app.stylesBuild)) // Ghi CSS vào thư mục đích
    .pipe(devBuild ? browserSync.reload({ stream: true }) : noop()); // Reload BrowserSync nếu là devBuild
};

export default styles;
