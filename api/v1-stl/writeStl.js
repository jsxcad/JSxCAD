import { Shape, ensurePages } from '@jsxcad/api-v2';
import {
  addPending,
  emit,
  generateUniqueId,
  getModule,
  getPendingErrorHandler,
  write,
  writeFile,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toStl } from '@jsxcad/convert-stl';

export const prepareStl = (shape, name, options = {}) => {
  const { prepareStl = (s) => s } = options;
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(prepareStl(shape).toDisjointGeometry())) {
    const path = `stl/${getModule()}/${generateUniqueId()}`;
    const op = toStl(entry, options)
      .then((data) => write(path, data))
      .catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      // data: op,
      path,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    });
  }
  return entries;
};

const downloadStlMethod = function (name, options) {
  const entries = prepareStl(this, name, options);
  const download = { entries };
  // We should be saving the stl data in the filesystem.
  const hash = hashSum({ name }) + hashGeometry(this.toGeometry());
  emit({ download, hash });
  return this;
};
Shape.prototype.downloadStl = downloadStlMethod;
Shape.prototype.stl = downloadStlMethod;

export const writeStl = (shape, name, options = {}) => {
  for (const { data, filename } of prepareStl(shape, name, {})) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const method = function (...args) {
  return writeStl(this, ...args);
};
Shape.prototype.writeStl = method;

export default writeStl;
