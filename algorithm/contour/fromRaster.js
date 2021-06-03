import {
  deduplicatePath,
  isClockwisePath,
  translatePath,
} from '@jsxcad/geometry';

import MarchingSquares from 'marchingsquares/dist/marchingsquares.js';
import { fromPolygon as toPlaneFromPolygon } from '@jsxcad/math-plane';

export const fromRaster = async (raster, bands) => {
  const preprocessedData = new MarchingSquares.QuadTree(raster);

  const result = [];
  for (let nth = 0; nth < bands.length - 1; nth++) {
    const low = bands[nth];
    const high = bands[nth + 1];
    const paths = [];
    for (const band of MarchingSquares.isoBands(preprocessedData, low, high)) {
      const deduplicated = translatePath([0, 0, low], deduplicatePath(band));
      if (deduplicated.length >= 3 && toPlaneFromPolygon(deduplicated)) {
        if (isClockwisePath(deduplicated)) {
          // Ensure path is counter-clockwise.
          paths.push([...deduplicated].reverse());
        } else {
          paths.push(deduplicated);
        }
      }
    }
    if (paths.length > 0) {
      result.push(paths);
    }
  }
  return result;
};
