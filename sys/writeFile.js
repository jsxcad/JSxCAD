/* global self */

import * as fs from 'fs';

import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { dirname } from 'path';
import { fromByteArray } from 'base64-js';
import { getBase } from './filesystem';
import { getFile } from './files';
import localForage from 'localforage';

const { promises } = fs;

// FIX Convert data by representation.

export const writeFile = async (options, path, data) => {
  data = await data;

  const { as = 'utf8', ephemeral } = options;
  if (typeof data === 'string') {
    data = new TextEncoder(as).encode(data);
  }

  if (isWebWorker) {
    return self.ask({ writeFile: { options: { ...options, as: 'bytes' }, path, data: await data } });
  }
  const file = getFile(options, path);
  file.data = data;

  for (const watcher of file.watchers) {
    watcher(options, file);
  }

  const base = getBase();
  if (!ephemeral && base !== undefined) {
    const persistentPath = `jsxcad/${base}${path}`;
    if (isNode) {
      try {
        await promises.mkdir(dirname(persistentPath), { recursive: true });
      } catch (error) {
      }
      try {
        await promises.writeFile(persistentPath, data);
      } catch (error) {
        console.log(`QQ/writeFile/error: ${error.toString()}`);
      }
    } else if (isBrowser) {
      return localForage.setItem(persistentPath, fromByteArray(data));
    }
  }
};
