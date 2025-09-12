'use strict';

import { dist } from './_config.mjs';
import { deleteAsync } from 'del';

const clean = async done => {
  try {
    await deleteAsync(`${dist.dest}*`);
    // console.log('Cleaning completed successfully!');
  } catch (error) {
    console.error(`Error during cleaning: ${error.message}`);
  }
  done();
};

export default clean;
