import { flip as flipOfPath } from '@jsxcad/geometry-path';

export const flip = (paths) => paths.map(flipOfPath);
