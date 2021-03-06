import {
  addPending,
  emit,
  getDefinitions,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import Shape from '@jsxcad/api-v1-shape';
import { ensurePages } from '@jsxcad/api-v1-shapes';
import { hash as hashGeometry } from '@jsxcad/geometry-tagged';
import hashSum from 'hash-sum';
import { toGcode } from '@jsxcad/convert-gcode';

export const prepareGcode = (shape, name, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toGcode(entry, {
      definitions: getDefinitions(),
      ...options,
    }).catch(getPendingErrorHandler());
    addPending(op);
    entries.push({
      data: op,
      filename: `${name}_${index++}.gcode`,
      // CHECK: Is this a reasonable mime type?
      type: 'application/x-gcode',
    });
  }
  return entries;
};

const downloadGcodeMethod = function (name, options = {}) {
  const entries = prepareGcode(this, name, options);
  const download = { entries };
  const hash = hashSum({ name, options }) + hashGeometry(this.toGeometry());
  emit({ download, hash });
  return this;
};
Shape.prototype.downloadGcode = downloadGcodeMethod;

export const writeGcode = (shape, name, options = {}) => {
  for (const { data, filename } of prepareGcode(shape, name, options)) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const writeGcodeMethod = function (...args) {
  return writeGcode(this, ...args);
};
Shape.prototype.writeGcode = writeGcodeMethod;

export default writeGcode;
