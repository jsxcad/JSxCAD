import { pathnameToFont, textToSurfaces } from '@jsxcad/algorithm-text';
import { CAG } from './CAG';
import { union } from '@jsxcad/algorithm-z0polygons';

export const loadFont = ({ path }) => pathnameToFont(path);

// We do an early union to handle overlapping text.

export const text = ({ font, curveSegments }, text) =>
  CAG.fromPaths(union(...textToSurfaces({ font: font, curveSegments }, text)));
