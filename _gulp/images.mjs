'use strict';

import gulp from 'gulp';
import { dist, app } from './_config.mjs';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import webp from 'gulp-webp';

const { src, dest } = gulp;

//--------- Image optimization task
const optimizeImages = () => {
  return src(app.image, { encoding: false })
    .pipe(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 }),
      svgo({
        plugins: [
          { name: 'removeViewBox', active: true },
          { name: 'cleanupIDs', active: false }
        ]
      })
    ]))
    .pipe(dest(dist.dest));
};

//--------- Copy images task
const copyImages = () => {
  return src(app.image, { encoding: false })
    .pipe(dest(dist.dest));
};

//--------- Main image task based on environment
const images = (done) => {
  if (process.env.NODE_ENV === 'production') {
    optimizeImages();
  } else {
    copyImages();
  }
  done();
};

//--------- WebP conversion task
export const convertToWebp = () => {
  return src(`${dist.src}/assets/img/webp/*.{png,jpg}`, { encoding: false })
    .pipe(webp())
    .pipe(dest(dist.dest));
};

//--------- Export the task
export default images;
