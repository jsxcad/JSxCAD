import { pathnameToFont, textToSurfaces } from '@jsxcad/algorithm-text';

import { Shape } from './Shape';

export const loadFont = ({ path }) => pathnameToFont(path);

// We do an early union to handle overlapping text.

export const text = ({ font, curveSegments }, text) =>
  Shape.fromGeometry(textToSurfaces({ font: font, curveSegments }, text));
