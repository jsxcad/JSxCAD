import { pathnameToFont, textToSurfaces } from '@jsxcad/algorithm-text';
import { Z0Surface } from './Z0Surface';
import { union } from '@jsxcad/algorithm-z0surface';

export const loadFont = ({ path }) => pathnameToFont(path);

// We do an early union to handle overlapping text.

export const text = ({ font, curveSegments }, text) =>
  Z0Surface.fromPaths(union(...textToSurfaces({ font: font, curveSegments }, text)));
