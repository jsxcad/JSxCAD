/* global self */

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { dirname } from 'path';
import { getFile } from './files';
import localForage from 'localforage';

const { promises } = fs;

// FIX Convert data by representation.

export const writeFile = async (options, path, data) => {
  const { as = 'utf8', ephemeral } = options;
  if (isWebWorker) {
    return self.ask({ writeFile: { options: { as, ...options }, path, data: await data } });
  }

  data = await data;
  const file = getFile(options, path);
  file.as = as;
  file.data = data;

  for (const watcher of file.watchers) {
    watcher(options, file);
  }

  if (!ephemeral) {
    if (isNode) {
      try {
        await promises.mkdir(dirname(path), { recursive: true });
      } catch (error) {
        console.log(`QQ/mkdir: ${error.toString()}`);
      }
      return promises.writeFile(path, data);
    } else if (isBrowser) {
      return localForage.setItem(`file/${path}`, data);
    }
  }
};
