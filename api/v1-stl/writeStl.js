import {
  addPending,
  emit,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import { Shape } from '@jsxcad/api-v1-shape';
import { toStl as convertToStl } from '@jsxcad/convert-stl';
import { ensurePages } from '@jsxcad/api-v1-layout';
import { hash as hashGeometry } from '@jsxcad/geometry-tagged';
import hashSum from 'hash-sum';

export const prepareStl = (shape, name, options = {}) => {
  // CHECK: Should this be limited to Page plans?
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = convertToStl(entry, options).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.stl`,
      type: 'application/sla',
    });
  }
  return entries;
};

const downloadStlMethod = function (name, options = {}) {
  const entries = prepareStl(this, name, options);
  const download = { entries };
  // We should be saving the stl data in the filesystem.
  const hash = hashSum({ name, options }) + hashGeometry(this.toGeometry());
  emit({ download, hash });
  return this;
};
Shape.prototype.downloadStl = downloadStlMethod;

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
