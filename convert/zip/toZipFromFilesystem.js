import { listFiles, qualifyPath, readFile } from '@jsxcad/sys';

import { toArray } from 'do-not-zip';

export const toZipFromFilesystem = async ({ filterPath = (a => true), transformPath = (a => a) } = {}) => {
  const entries = [];
  for (const file of await listFiles()) {
    const data = await readFile({ as: 'bytes' }, file);
    const path = transformPath(qualifyPath(file));
    if (filterPath(path)) {
      entries.push({
        path,
        data: new Uint8Array(data)
      });
    }
  }
  return new Uint8Array(toArray(entries));
};
