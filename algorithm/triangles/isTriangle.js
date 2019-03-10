import { isClosed } from '@jsxcad/algorithm-path';

export const isTriangle = (path) => isClosed(path) && path.length === 3;
