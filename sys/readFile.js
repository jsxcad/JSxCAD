import { isBrowser, isNode } from './browserOrNode';

const { getFile } = require('./files');

export const readFile = async (path, options = {}) => {
  if (isNode) {
    // FIX: Put this through getFile, also.
    const fs = await import('fs');
    return fs.promises.readFile(path, options);
  } else if (isBrowser) {
    const file = getFile(path);
    if (typeof file.data === 'function') {
      // Force lazy evaluation.
      file.data = file.data();
    }
    return file.data;
  } else {
    throw Error('die');
  }
};
