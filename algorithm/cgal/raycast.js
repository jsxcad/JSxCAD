import { STATUS_OK } from './status.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const raycast = (
  inputs,
  {
    xStart = 0,
    xStride = 0,
    xSteps = 0,
    yStart = 0,
    yStride = 0,
    ySteps = 0,
    z = 0,
    points = [],
  }
) =>
  withCgalGeometry('raycast', inputs, (cgalGeometry, g) => {
    const status = g.Raycast(
      cgalGeometry,
      Number(xStart),
      Number(xStride),
      Number(xSteps),
      Number(yStart),
      Number(yStride),
      Number(ySteps),
      Number(z),
      points
    );
    switch (status) {
      case STATUS_OK:
        return true;
      default:
        throw new Error(`Unexpected status ${status} in raycast`);
    }
  });
