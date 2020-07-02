import { isClosed } from './isClosed.js';

export const open = (path) => (isClosed(path) ? [null, ...path] : path);
