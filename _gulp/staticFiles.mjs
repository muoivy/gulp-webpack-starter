'use strict';

import gulp from 'gulp';
import { app, dist } from './_config.mjs';

const { src, dest } = gulp;

//--------- Static processing task
const staticFiles = () => {
  return src(`${dist.src}/assets/static/**/[^_]*`)
    .pipe(dest(`${dist.dest}/assets/`));
}

//--------- Export the task
export default staticFiles;
