import { outline as outlineSurface } from '@jsxcad/geometry-surface';

export const outline = (solid, normalize) => solid.flatMap(surface => outlineSurface(surface, normalize));
