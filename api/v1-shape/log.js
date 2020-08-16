import { emit, log as sysLog } from '@jsxcad/sys';

import Shape from './Shape.js';

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
  emit({ log: { text, level } });
  return sysLog({ op: 'text', text, level });
};

export const logOp = (shape, op) => {
  const text = String(op(shape));
  emit({ log: { text } });
  return sysLog({ op: 'text', text });
};

const logMethod = function (
  op = (shape) => JSON.stringify(shape.toKeptGeometry())
) {
  logOp(this, op);
  return this;
};
Shape.prototype.log = logMethod;

export default log;
