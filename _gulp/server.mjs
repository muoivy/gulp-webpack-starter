'use strict';

import gulp from 'gulp';
import { dist, app } from './_config.mjs';
import browserSync from 'browser-sync';
import connectSSI from 'connect-ssi';
import phpConnect from 'gulp-connect-php';
import html from './html.mjs';
import styles from './styles.mjs';
import bundle from './bundle.mjs';
import staticFiles from './staticFiles.mjs';
import images from './images.mjs';

const { watch, series, parallel } = gulp;

//--------- Create a BrowserSync instance
const browser = browserSync.create();

//--------- Browser sync - local Server
const localServer = done => {
  phpConnect.server({ base: dist.dest }, () => {
    browser.init({
      server: {
        baseDir: dist.dest,
      },
      middleware: connectSSI({
        baseDir: dist.dest,
        ext: '.html'
      }),
      ghostMode: false,
      notify: false,
      online: true,
      open: 'external'
    });
  });
  done();
};

//--------- Reload browser Sync
const reload = done => {
  browser.reload();
  done();
};

//--------- Watch Files
const watchAssets = () => {
  // HTML changes
  watch(app.html, series(html, reload));

  // CSS changes
  watch(`${app.styles}/**/*.scss`, series(styles, reload));

  // JavaScript changes
  watch(`${app.scripts}/**/*.js`, series(bundle, reload));

  // Static changes
  watch(`${dist.src}/assets/static/**/[^_]*`, series(staticFiles, reload));

  // Image changes
  watch(app.image, series(images, reload));
};

//--------- Combine server setup and file watching
const server = series(localServer, watchAssets);

//--------- Export the server task
export default server;
