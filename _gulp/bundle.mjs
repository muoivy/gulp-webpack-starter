'use strict';

import gulp from 'gulp';
import { app } from './_config.mjs';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.mjs';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';

const { src, dest } = gulp;

//--------- Bundle task
export const bundle = () => {
  return webpackStream(webpackConfig, webpack)  // Chỉ định file JS gốc
  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
  .pipe(dest(app.scriptsBuild))
};

//--------- Export as default task
export default bundle;
