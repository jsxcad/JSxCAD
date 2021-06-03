import { close as closePath } from '../geometry-path';

export const close = (paths) => paths.map(closePath);
