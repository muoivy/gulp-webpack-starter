'use strict';

export const dist = {
  src: './_src',
  dest: './_html'
};

export const app = {
  html: `${dist.src}/**/*.html`,
  php: `${dist.src}/**/*.php`,
  styles: `${dist.src}/assets/css`,
  stylesBuild: `${dist.dest}/assets/css`,
  scripts: `${dist.src}/assets/js`,
  scriptsBuild: `${dist.dest}/assets/js`,
  image: `${dist.src}/**/*.{png,jpg,gif,svg}`
};

export const devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');
