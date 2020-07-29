import { buildRegularPolygon } from './buildRegularPolygon.js';
import { cache } from '@jsxcad/cache';
import { extrude } from './extrude.js';
import { translate } from '@jsxcad/geometry-path';

/** @type {function(edges:number):Solid} */
const buildRegularPrismImpl = (edges = 32) => {
  const path = buildRegularPolygon(edges);
  /** @type {Surface} */
  const surface = [translate([0, 0, -0.5], path)];
  return extrude(surface, 1);
};

/**
 * Builds a regular prism of height 1 with the specified number of edges.
 * @type {function(edges:number):Solid}
 */
export const buildRegularPrism = cache(buildRegularPrismImpl);
