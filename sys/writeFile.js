/* global self */

import { isNode, isWebWorker } from './browserOrNode';

import * as fs from 'fs';
import { getFile } from './files';

export const writeFile = async (options, path, data) => {
  if (isWebWorker) {
    return self.ask({ writeFile: { options, path, data: await data } });
  }
  const { ephemeral } = options;

  data = await data;
  const file = getFile(options, path);
  file.data = data;

  for (const watcher of file.watchers) {
    watcher(options, file);
  }

  if (!ephemeral) {
    if (isNode) {
      return fs.promises.writeFile(path, data);
    }
  }
};
