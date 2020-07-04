import { addPending, emit, writeFile } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';
import { toThreejsPage } from '@jsxcad/convert-threejs';

export const prepareThreejsPage = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toThreejsPage(entry, options);
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

export const writeThreejsPage = async (shape, name, options = {}) => {
  for (const { data, filename } of prepareThreejsPage(shape, name, {})) {
    await writeFile({ doSerialize: false }, `output/${filename}`, data);
  }
};

const writeThreejsPageMethod = function (...args) {
  return writeThreejsPage(this, ...args);
};
Shape.prototype.writeThreejsPage = writeThreejsPageMethod;

export default writeThreejsPage;
