'use strict';

import gulp from 'gulp';
import { app, dist } from './_config.mjs';
import ssi from 'gulp-ssi';
import htmlhint from 'gulp-htmlhint';
import formatHTML from 'gulp-format-html';

const { src, dest } = gulp;

//--------- HTML processing task
const html = () => {
  return src([app.html, `!${dist.src}/assets/_includes/*.html`])
    .pipe(ssi({ root: dist.src }))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    // .pipe(formatHTML())
    .pipe(dest(dist.dest));
};

//--------- Export the task
export default html;
