import {
  addPending,
  emit,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-shapes';
import { toDxf } from '@jsxcad/convert-dxf';

export const prepareDxf = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toDxf(entry, options).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.dxf`,
      type: 'application/dxf',
    });
  }
  return entries;
};

const downloadDxfMethod = function (...args) {
  const entries = prepareDxf(this, ...args);
  emit({ download: { entries } });
  return this;
};
Shape.prototype.downloadDxf = downloadDxfMethod;

export const writeDxf = (shape, name, options = {}) => {
  for (const { data, filename } of prepareDxf(shape, name, {})) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const writeDxfMethod = function (...args) {
  return writeDxf(this, ...args);
};
Shape.prototype.writeDxf = writeDxfMethod;

export default writeDxf;
