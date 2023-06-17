import { STATUS_OK, STATUS_ZERO_THICKNESS } from './status.js';
import { ErrorZeroThickness } from './error.js';
import { withCgalGeometry } from './cgalGeometry.js';

export const eachTriangle = (inputs, emitTriangle) => {
  let triangle = [];
  const admitPoint = (x, y, z) => {
    triangle.push([x, y, z]);
    if (triangle.length === 3) {
      emitTriangle(triangle);
      triangle = [];
    }
  };
  return withCgalGeometry('eachTriangle', inputs, (cgalGeometry, g) => {
    const status = g.EachTriangle(cgalGeometry, admitPoint);
    switch (status) {
      case STATUS_ZERO_THICKNESS:
        throw new ErrorZeroThickness(
          'Zero thickness produced by eachTriangles'
        );
      case STATUS_OK:
        return;
      default:
        throw new Error(`Unexpected status ${status}`);
    }
  });
};
