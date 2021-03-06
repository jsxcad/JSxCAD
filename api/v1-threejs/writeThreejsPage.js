import {
  addPending,
  emit,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-shapes';
import { toThreejsPage } from '@jsxcad/convert-threejs';

export const prepareThreejsPage = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toThreejsPage(entry, options).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.html`,
      type: 'text/html',
    });
  }
  return entries;
};

const downloadThreejsPageMethod = function (...args) {
  const entries = prepareThreejsPage(this, ...args);
  emit({ download: { entries } });
  return this;
};
Shape.prototype.downloadThreejsPage = downloadThreejsPageMethod;

export const writeThreejsPage = (shape, name, options = {}) => {
  for (const { data, filename } of prepareThreejsPage(shape, name, {})) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const writeThreejsPageMethod = function (...args) {
  return writeThreejsPage(this, ...args);
};
Shape.prototype.writeThreejsPage = writeThreejsPageMethod;

export default writeThreejsPage;
