import {
  addPending,
  emit,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import { Shape } from '@jsxcad/api-v1-shape';
import { toStl as convertToStl } from '@jsxcad/convert-stl';
import { ensurePages } from '@jsxcad/api-v1-layout';

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

const downloadStlMethod = function (...args) {
  const entries = prepareStl(this, ...args);
  emit({ download: { entries } });
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
