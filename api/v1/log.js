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

export const log = (text) => sysLog({ op: 'text', text: String(text) });

export default log;
