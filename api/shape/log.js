import { computeHash, emit, log as sysLog } from '@jsxcad/sys';

import Shape from './Shape.js';
import { realize } from '@jsxcad/geometry';

/**
 *
 * # Log
 *
 * Writes a string to the console.
 *
 * ```
 * log("Hello, World")
 * ```
 *
 **/

const toText = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
};

export const log = (value, level) => {
  const text = toText(value);
  const log = { text, level };
  const hash = computeHash(log);
  emit({ log, hash });
  return sysLog({ op: 'text', text, level });
};

export const logOp = (shape, op) => {
  const text = String(op(shape));
  const level = 'serious';
  const log = { text, level };
  const hash = computeHash(log);
  emit({ log, hash });
  return sysLog({ op: 'text', text });
};

const logMethod = function (op = (shape) => JSON.stringify(shape)) {
  logOp(Shape.fromGeometry(realize(this.toGeometry())), op);
  return this;
};
Shape.prototype.log = logMethod;

export default log;
