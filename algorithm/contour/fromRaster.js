import { deduplicate, isClockwise, translate } from '@jsxcad/geometry-path';

import MarchingSquares from 'marchingsquares';
import { fromPolygon as toPlaneFromPolygon } from '@jsxcad/math-plane';

export const fromRaster = async (raster, bands) => {
  const preprocessedData = new MarchingSquares.QuadTree(raster);

  const result = [];
  for (let nth = 0; nth < bands.length - 1; nth++) {
    const low = bands[nth];
    const high = bands[nth + 1];
    const paths = [];
    for (const band of MarchingSquares.isoBands(preprocessedData, low, high)) {
      const deduplicated = translate([0, 0, low], deduplicate(band));
      if (deduplicated.length >= 3 && toPlaneFromPolygon(deduplicated)) {
        if (isClockwise(deduplicated)) {
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
