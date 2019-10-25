/* global self */

import * as fs from 'fs';

import { getBase, getFilesystem, setupFilesystem } from './filesystem';
import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { dirname } from 'path';
import { fromByteArray } from 'base64-js';
import { getFile } from './files';
import localForage from 'localforage';
import { log } from './log';

const { promises } = fs;

// FIX Convert data by representation.

export const writeFile = async (options, path, data) => {
  data = await data;

  if (isWebWorker) {
    return self.ask({ writeFile: { options: { ...options, as: 'bytes' }, path, data: await data } });
  }

  const { as = 'utf8', ephemeral, project = getFilesystem() } = options;
  let originalProject = getFilesystem();
  if (project !== originalProject) {
    log(`Write ${path} of ${project}`);
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: project });
  }

  if (typeof data === 'string') {
    data = new TextEncoder(as).encode(data);
  }

  await log(`Write ${path}`);
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
      await localForage.setItem(persistentPath, fromByteArray(data));
    }
  }

  if (project !== originalProject) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalProject });
  }
};
