import { flip as flipSurface } from '@jsxcad/algorithm-surface';

export const flip = (solid) => solid.map(surface => flipSurface(surface));
