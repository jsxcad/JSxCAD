import { isClosed } from './isClosed';

export const open = (path) => (isClosed(path) ? [null, ...path] : path);
