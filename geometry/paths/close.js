import { close as closePath } from '@jsxcad/geometry-path';

export const close = (paths) => paths.map(closePath);
