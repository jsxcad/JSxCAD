import { linearize, transformCoordinate } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';

// FIX: This is probably the wrong approach to moving to a particular location.
export const moveTo =
  (x = 0, y = 0, z = 0) =>
  (shape) => {
    x = Shape.toValue(x, shape);
    y = Shape.toValue(y, shape);
    z = Shape.toValue(z, shape);
    // Allow a Point to be provided.
    if (x instanceof Shape) {
      const geometry = linearize(
        x.toGeometry(),
        ({ type, points }) => type === 'points' && points.length >= 1
      );
      if (geometry.length >= 1) {
        const { matrix, points } = geometry[0];
        const point = transformCoordinate(points[0], matrix);
        [x, y, z] = point;
      }
    }
    if (!isFinite(x)) {
      x = 0;
    }
    if (!isFinite(y)) {
      y = 0;
    }
    if (!isFinite(z)) {
      z = 0;
    }
    return shape.transform(fromTranslateToTransform(-x, -y, -z));
  };

Shape.registerMethod('moveTo', moveTo);

export default moveTo;
