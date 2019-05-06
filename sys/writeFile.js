import { isBrowser, isNode } from './browserOrNode';

import { getFile } from './files';

export const writeFile = async (options, path, data) => {
  data = await data;
  if (isNode) {
    const fs = await import('fs');
    let result = await fs.promises.writeFile(path, data);
    return result;
  } else if (isBrowser) {
    const file = getFile(path);
    file.data = data;
    for (const watcher of file.watchers) {
      watcher(options, file);
    }
  } else {
    throw Error('die');
  }
};
