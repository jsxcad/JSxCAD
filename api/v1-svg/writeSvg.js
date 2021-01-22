import {
  addPending,
  emit,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-layout';
import { hash as hashGeometry } from '@jsxcad/geometry-tagged';
import hashSum from 'hash-sum';
import { toSvg } from '@jsxcad/convert-svg';

export const prepareSvg = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toSvg(entry, options).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.svg`,
      type: 'image/svg+xml',
    });
  }
  return entries;
};

const downloadSvgMethod = function (name, options = {}) {
  const entries = prepareSvg(this, name, options);
  const download = { entries };
  const hash = hashSum({ name, options }) + hashGeometry(this.toGeometry());
  emit({ download, hash });
  return this;
};
Shape.prototype.downloadSvg = downloadSvgMethod;

export const writeSvg = (shape, name, options = {}) => {
  for (const { data, filename } of prepareSvg(shape, name, {})) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const writeSvgMethod = function (...args) {
  return writeSvg(this, ...args);
};
Shape.prototype.writeSvg = writeSvgMethod;

export default writeSvg;
