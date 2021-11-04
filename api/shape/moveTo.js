import Shape from './Shape.js';
import { fromTranslation } from '@jsxcad/math-mat4';

// FIX: This is probably the wrong approach to moving to a particular location.
export const moveTo =
  (x = 0, y = 0, z = 0) =>
  (shape) => {
    x = Shape.toValue(x, shape);
    y = Shape.toValue(y, shape);
    z = Shape.toValue(z, shape);
    // Allow a Point to be provided.
    if (x instanceof Shape) {
      const g = x.toTransformedGeometry();
      if (g.type === 'points' && g.points.length === 1) {
        // FIX: Consider how this might be more robust.
        [x, y, z] = g.points[0];
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
    return shape.transform(fromTranslation([-x, -y, -z]));
  };

Shape.registerMethod('moveTo', moveTo);

export default moveTo;
