import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSolidToCleanSolid } from '@jsxcad/geometry-halfedge';
import { makeWatertight } from './makeWatertight.js';

export let doCheckOverlap = false;
export let doDefragment = 'none';

/** @type {function(Polygon[],Normalizer):Solid} */
export const fromPolygons = (polygons, normalize = createNormalize3()) => {
  const watertightSolid = makeWatertight([polygons], normalize);
  const cleanedSolid = fromSolidToCleanSolid(watertightSolid, normalize);
  return cleanedSolid;
};
