import { buildRegularPolygon } from './buildRegularPolygon.js';
import { cache } from '@jsxcad/cache';
import { extrude } from './extrude.js';
import { translate } from '@jsxcad/geometry-path';

const buildRegularPrismImpl = (edges = 32) => {
  const path = buildRegularPolygon(edges);
  return extrude([translate([0, 0, -0.5], path)], 1);
};

export const buildRegularPrism = cache(buildRegularPrismImpl);
