import { close as closePath } from '../path/close.js';

export const close = (paths) => paths.map(closePath);
