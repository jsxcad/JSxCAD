/* global Blob, document */

import { qualifyPath } from '@jsxcad/sys';
import saveAs from 'file-saver';
import { toZipFromFilesystem } from '@jsxcad/convert-zip';

const doDownload = async (filename) => {
  const prefix = `${qualifyPath('output')}/`;
  const filterPath = path => path.startsWith(prefix);
  const transformPath = path => `${filename}/${path.substring(prefix.length)}`;
  const zip = await toZipFromFilesystem({ filterPath, transformPath });
  const blob = new Blob([zip.buffer], { type: 'application/zip' });
  saveAs(blob, `${filename}.zip`);
};

export const download = (filename = 'project.zip') => {
  const button = document.createElement('button');
  button.innerHTML = 'Download';
  button.onclick = () => doDownload(filename);
  return button;
};

export default download;
