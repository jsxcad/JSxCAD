import { computeHash, emit, log as sysLog } from '@jsxcad/sys';

import Shape from './Shape.js';
import { serialize } from '@jsxcad/geometry';

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

export const log = Shape.registerMethod('log', (prefix = '') => async (shape) => {
  const text = prefix + JSON.stringify(await shape.toGeometry());
  const level = 'serious';
  const log = { text, level };
  const hash = computeHash(log);
  console.log(`QQQQ/log: ${text}`);
  emit({ log, hash });
  sysLog({ op: 'text', text });
  return shape;
});

export default log;
