import { Shape, ensurePages } from '@jsxcad/api-shape';
import {
  addPending,
  emit,
  getDefinitions,
  getPendingErrorHandler,
  writeFile,
} from '@jsxcad/sys';

import { hash as hashGeometry } from '@jsxcad/geometry';
import hashSum from 'hash-sum';
import { toGcode } from '@jsxcad/convert-gcode';

export const prepareGcode = (shape, name, tool, options = {}) => {
  let index = 0;
  const entries = [];
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    const op = toGcode(entry, tool, {
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

const downloadGcodeMethod = function (name, tool, options = {}) {
  const entries = prepareGcode(this, name, tool, options);
  const download = { entries };
  const hash =
    hashSum({ name, tool, options }) + hashGeometry(this.toGeometry());
  emit({ download, hash });
  return this;
};
Shape.prototype.downloadGcode = downloadGcodeMethod;
Shape.prototype.gcode = downloadGcodeMethod;

export const writeGcode = (shape, name, tool, options = {}) => {
  for (const { data, filename } of prepareGcode(shape, name, tool, options)) {
    addPending(writeFile({ doSerialize: false }, `output/${filename}`, data));
  }
  return shape;
};

const writeGcodeMethod = function (...args) {
  return writeGcode(this, ...args);
};
Shape.prototype.writeGcode = writeGcodeMethod;

export default writeGcode;
