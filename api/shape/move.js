import Shape from './Shape.js';
import { fromTranslation } from '@jsxcad/math-mat4';

// FIX: Consider how exact values might be used.
export const move =
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
    return shape.transform(fromTranslation([x, y, z]));
  };

export const xyz = move;

Shape.registerMethod('move', move);
Shape.registerMethod('xyz', xyz);

export default move;
