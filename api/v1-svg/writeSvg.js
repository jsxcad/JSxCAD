import { Shape, ensurePages } from '@jsxcad/api-v2';
import {
  addPending,
  emit,
  getDefinitions,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toSvg } from '@jsxcad/convert-svg';

export const prepareSvg = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toDisjointGeometry())) {
    const op = toSvg(entry, {
      definitions: getDefinitions(),
      ...options,
    }).catch(getPendingErrorHandler());
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
Shape.prototype.svg = downloadSvgMethod;

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
