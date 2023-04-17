import { computeHash, emit, log as sysLog } from '@jsxcad/sys';

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

export const log = Shape.registerMethod(
  'log',
  (prefix = '') =>
    async (shape) => {
      const text = prefix + JSON.stringify(await shape.toGeometry());
      const level = 'serious';
      const log = { text, level };
      const hash = computeHash(log);
      emit({ log, hash });
      sysLog({ op: 'text', text });
      console.log(text);
      return shape;
    }
);

export default log;
