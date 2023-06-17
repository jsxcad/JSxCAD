import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const fromPolygonSoup = (
  jsPolygons,
  tolerance = 0.01,
  wrapAlways = false,
  wrapRelativeAlpha = 300,
  wrapRelativeOffset = 5000,
  wrapAbsoluteAlpha = 0,
  wrapAbsoluteOffset = 0,
  simplifyRatio = 0
) => {
  console.log(
    `QQ/fromPolygonSoup: ${JSON.stringify({
      tolerance,
      wrapAlways,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      simplifyRatio,
    })}`
  );

  return withCgalGeometry('fromPolygonSoup', [], (cgalGeometry, g) => {
    const status = g.FromPolygonSoup(
      cgalGeometry,
      (triples, polygons) => {
        let index = 0;
        // FIX: Prefer exactPoints
        for (const { points } of jsPolygons) {
          // FIX: Clean this up and use exactPoints.
          const polygon = new g.Polygon();
          for (const [x, y, z] of points) {
            g.addTriple(triples, x, y, z, tolerance);
            g.Polygon__push_back(polygon, index++);
          }
          polygons.push_back(polygon);
        }
      },
      wrapAlways,
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      simplifyRatio
    );
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by fromPolygons');
      case STATUS_OK:
        return fromCgalGeometry(cgalGeometry, [], cgalGeometry.getSize(), 0);
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};
