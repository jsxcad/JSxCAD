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

export const log = Shape.registerMethod2(
  'log',
  ['input', 'string'],
  async (input, prefix = '') => {
    console.log(`QQ/log`);
    const text = prefix + JSON.stringify(await input.toGeometry());
    const level = 'serious';
    const log = { text, level };
    const hash = computeHash(log);
    emit({ log, hash });
    sysLog({ op: 'text', text });
    console.log(text);
    return input;
  }
);

export default log;
