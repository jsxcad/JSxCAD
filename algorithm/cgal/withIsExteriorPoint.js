import { STATUS_OK } from './status.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const withIsExteriorPoint = (inputs, op) =>
  withCgalGeometry('withIsExteriorPoint', inputs, (cgalGeometry, g) => {
    const status = g.IsExteriorPointPrepare(cgalGeometry);
    switch (status) {
      case STATUS_OK: {
        const isExteriorPoint = (x = 0, y = 0, z = 0) =>
          g.IsExteriorPoint(cgalGeometry, x, y, z);
        return op(isExteriorPoint);
      }
      default:
        throw new Error(`Unexpected status ${status} in withIsExteriorPoint`);
    }
  });
