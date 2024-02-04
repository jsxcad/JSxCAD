import { Group, Points, fill, link } from '@jsxcad/geometry';

import MarchingSquares from 'marchingsquares/dist/marchingsquares.js';

export const fromRaster = (raster, bands) => {
  const preprocessedData = new MarchingSquares.QuadTree(raster);

  const perBand = [];
  for (let nth = 0; nth < bands.length - 1; nth++) {
    const contours = [];
    const low = bands[nth];
    const high = bands[nth + 1];
    for (const band of MarchingSquares.isoBands(preprocessedData, low, high)) {
      contours.push(link(Points(band), [], /* close= */ true));
    }
    perBand.push(fill(Group(contours)));
  }
  return perBand;
};
