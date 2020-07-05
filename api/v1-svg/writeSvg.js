import { addPending, emit, writeFile } from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';
import { toSvg } from '@jsxcad/convert-svg';

export const prepareSvg = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toSvg(entry, options);
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.svg`,
      type: 'image/svg+xml',
    });
  }
  return entries;
};

const downloadSvgMethod = function (...args) {
  const entries = prepareSvg(this, ...args);
  emit({ download: { entries } });
  return this;
};
Shape.prototype.downloadSvg = downloadSvgMethod;

export const writeSvg = async (shape, name, options = {}) => {
  for (const { data, filename } of prepareSvg(shape, name, {})) {
    await writeFile({ doSerialize: false }, `output/${filename}`, data);
  }
};

const writeSvgMethod = function (...args) {
  return writeSvg(this, ...args);
};
Shape.prototype.writeSvg = writeSvgMethod;

export default writeSvg;
