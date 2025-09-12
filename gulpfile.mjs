'use strict';

import gulp from 'gulp';
import clean from './_gulp/clean.mjs';
import server from './_gulp/server.mjs';
import html from './_gulp/html.mjs';
import bundle from './_gulp/bundle.mjs';
import styles from './_gulp/styles.mjs';
import images, { convertToWebp } from './_gulp/images.mjs';
import staticFiles from './_gulp/staticFiles.mjs';

const { series, parallel } = gulp;

//--------- Run Default
export default series(clean, html, styles, bundle, images, staticFiles, server);

//--------- Run Build
export const build = series(clean, html, styles, bundle, images, staticFiles);

//--------- Run WebP conversion
export const convertImage = series(clean, convertToWebp);
