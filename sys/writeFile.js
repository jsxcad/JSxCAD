/* global self */

import * as fs from 'fs';

import { getBase, getFilesystem, qualifyPath, setupFilesystem } from './filesystem';
import { isBrowser, isNode, isWebWorker } from './browserOrNode';

import { db } from './db';
import { dirname } from 'path';
import { getFile } from './files';
import { log } from './log';

const { promises } = fs;

// FIX Convert data by representation.

export const writeFile = async (options, path, data) => {
  data = await data;
  // FIX: Should be checking for a proxy fs, not webworker.
  if (isWebWorker) {
    return self.ask({ writeFile: { options: { ...options, as: 'bytes' }, path, data: await data } });
  }

  const { as = 'utf8', ephemeral, project = getFilesystem() } = options;
  let originalProject = getFilesystem();
  if (project !== originalProject) {
    log({ op: 'text', text: `Write ${path} of ${project}` });
    // Switch to the source filesystem, if necessary.
    setupFilesystem({ fileBase: project });
  }

  if (typeof data === 'string') {
    data = new TextEncoder(as).encode(data);
  }

  await log({ op: 'text', text: `Write ${path}` });
  const file = await getFile(options, path);
  file.data = data;

  for (const watcher of file.watchers) {
    await watcher(options, file);
  }

  const base = getBase();
  if (!ephemeral && base !== undefined) {
    const persistentPath = qualifyPath(path);
    if (isNode) {
      try {
        await promises.mkdir(dirname(persistentPath), { recursive: true });
      } catch (error) {
      }
      try {
        await promises.writeFile(persistentPath, data);
      } catch (error) {
      }
    } else if (isBrowser) {
      await db().setItem(persistentPath, data);
    }
  }

  if (project !== originalProject) {
    // Switch back to the original filesystem, if necessary.
    setupFilesystem({ fileBase: originalProject });
  }
};
