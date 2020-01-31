/* global Blob, document */

import saveAs from 'file-saver';
import { toZipFromFilesystem } from '@jsxcad/convert-zip';

const doDownload = async (filename) => {
  const zip = await toZipFromFilesystem();
  const blob = new Blob([zip.buffer], { type: 'application/zip' });
  saveAs(blob, filename);
};

export const download = (filename = 'project.zip') => {
  const button = document.createElement('button');
  button.innerHTML = 'Download';
  button.onclick = () => doDownload(filename);
  return button;
};

export default download;
