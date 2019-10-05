import { getFilesystem, listFiles, readFile } from '@jsxcad/sys';

import { toArray } from 'do-not-zip';

export const toZipFromFilesystem = async (options = {}) => {
  const entries = [];
  const prefix = `jsxcad/${getFilesystem()}`;
  for (const file of await listFiles()) {
    const data = await readFile({ as: 'bytes' }, file);
    entries.push({
      path: `${prefix}/${file}`,
      data: new Uint8Array(data)
    });
  }
  return new Uint8Array(toArray(entries));
};
