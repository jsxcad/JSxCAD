import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { fromCgalGeometry, withCgalGeometry } from './cgalGeometry.js';

import { ErrorZeroThickness } from './error.js';

export const fromPolygons = (jsPolygons, close = false, tolerance = 0.001) => {
  return withCgalGeometry('fromPolygons', [], (cgalGeometry, g) => {
    const status = g.FromPolygons(cgalGeometry, close, (triples, polygons) => {
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
    });
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
