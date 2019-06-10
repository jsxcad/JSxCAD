/* global self */

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { base } from './filesystem';
import { dirname } from 'path';
import { fromByteArray } from 'base64-js';
import { getFile } from './files';
import localForage from 'localforage';

const { promises } = fs;

// FIX Convert data by representation.

export const writeFile = async (options, path, data) => {
  data = await data;

  const { as = 'utf8', ephemeral } = options;
  if (as === 'bytes') {
  } else {
    data = new TextEncoder(as).encode(data);
  }
  if (isWebWorker) {
    return self.ask({ writeFile: { options, path, data: await data } });
  }
  const file = getFile(options, path);
  file.data = data;

  for (const watcher of file.watchers) {
    watcher(options, file);
  }

  if (!ephemeral) {
    const persistentPath = `${base}${path}`;
    if (isNode) {
      try {
        await promises.mkdir(dirname(persistentPath), { recursive: true });
      } catch (error) {
        console.log(`QQ/mkdir: ${error.toString()}`);
      }
      return promises.writeFile(persistentPath, data);
    } else if (isBrowser) {
      return localForage.setItem(`file/${persistentPath}`, fromByteArray(data));
    }
  }
};
