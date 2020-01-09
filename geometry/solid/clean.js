import { clean as cleanSurface } from '@jsxcad/geometry-surface';

export const clean = (solid) => solid.map(cleanSurface);
