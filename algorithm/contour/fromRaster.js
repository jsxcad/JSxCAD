import { Link, taggedPoints } from '@jsxcad/geometry';

import MarchingSquares from 'marchingsquares/dist/marchingsquares.js';

export const fromRaster = async (raster, bands) => {
  const preprocessedData = new MarchingSquares.QuadTree(raster);

  const result = [];
  for (let nth = 0; nth < bands.length - 1; nth++) {
    const low = bands[nth];
    const high = bands[nth + 1];
    const paths = [];
    for (const band of MarchingSquares.isoBands(preprocessedData, low, high)) {
      result.push(Link([taggedPoints({}, band)], /* close= */ true));
    }
    if (paths.length > 0) {
      result.push(paths);
    }
  }
  return result;
};
