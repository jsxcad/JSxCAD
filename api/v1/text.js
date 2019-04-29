import { pathnameToFont, textToSurfaces } from '@jsxcad/algorithm-text';
import { Z0Surface } from './Z0Surface';

export const loadFont = ({ path }) => pathnameToFont(path);

// We do an early union to handle overlapping text.

export const text = ({ font, curveSegments }, text) =>
  Z0Surface.fromGeometry(textToSurfaces({ font: font, curveSegments }, text));
