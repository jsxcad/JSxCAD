import UnzipIt from 'unzipit';
import { writeFile } from '@jsxcad/sys';

export const fromZipToFilesystem = async (options = {}, zip) => {
  const { entries } = await UnzipIt.unzip(new Uint8Array(zip));
  for (const [name, entry] of Object.entries(entries)) {
    const [jsxcad, , ...path] = name.split('/');
    if (jsxcad !== 'jsxcad') {
      continue;
    }
    // Cut off the stored fs, and write into the current fs.
    const localPath = path.join('/');
    const data = new Uint8Array(await entry.arrayBuffer());
    await writeFile({ doSerialize: false }, localPath, data);
  }
};
