import Shape from './Shape';
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

const logMethod = function () { log(JSON.stringify(this.toKeptGeometry())); return this; };
Shape.prototype.log = logMethod;

log.signature = 'log(text:string)';

export default log;
