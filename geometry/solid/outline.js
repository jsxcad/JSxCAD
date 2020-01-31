import { outline as outlineSurface } from '@jsxcad/geometry-surface';

export const outline = (solid) => solid.map(outlineSurface);
