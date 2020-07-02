import Shape from './Shape.js';
import { log as sysLog } from '@jsxcad/sys';

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

export const log = (text, level) =>
  sysLog({ op: 'text', text: String(text), level });

export const logOp = (shape, op) =>
  sysLog({ op: 'text', text: String(op(shape)) });

const logMethod = function (
  op = (shape) => JSON.stringify(shape.toKeptGeometry())
) {
  logOp(this, op);
  return this;
};
Shape.prototype.log = logMethod;

log.signature = 'log(op:function)';

export default log;
