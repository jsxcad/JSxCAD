import { isBrowser, isNode } from './browserOrNode';

const { getFile } = require('./files');

export const writeFile = async (path, data, options = {}) => {
  data = await data;
  if (isNode) {
    const fs = await import('fs');
    let result = await fs.promises.writeFile(path, data);
    return result;
  } else if (isBrowser) {
    const file = getFile(path);
    file.data = data;
    for (const watcher of file.watchers) {
      watcher(file, options);
    }
  } else {
    throw Error('die');
  }
};
