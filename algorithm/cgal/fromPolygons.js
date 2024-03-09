import {
  GEOMETRY_POINTS,
  fromCgalGeometry,
  withCgalGeometry,
} from './cgalGeometry.js';
import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';

import { ErrorZeroThickness } from './error.js';

export const fromPolygons = (jsPolygons, close = false, tolerance = 0.001) => {
  return withCgalGeometry('fromPolygons', [], (cgalGeometry, g) => {
    cgalGeometry.setSize(jsPolygons.length);
    for (let nth = 0; nth < jsPolygons.length; nth++) {
      const { points } = jsPolygons[nth];
      cgalGeometry.setType(nth, GEOMETRY_POINTS);
      for (const [x, y, z] of points) {
        cgalGeometry.addInputPoint(nth, x, y, z);
      }
    }
    const status = g.FromPolygons(cgalGeometry, close);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness('Zero thickness produced by fromPolygons');
      case STATUS_OK:
        return fromCgalGeometry(
          cgalGeometry,
          [],
          cgalGeometry.getSize(),
          jsPolygons.length
        );
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};
