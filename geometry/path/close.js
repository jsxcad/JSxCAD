import { isClosed } from './isClosed.js';

export const close = (path) => (isClosed(path) ? path : path.slice(1));
