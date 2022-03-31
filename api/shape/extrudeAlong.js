import Point from './Point.js';
import Shape from './Shape.js';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';
import { normal } from './normal.js';

export const extrudeAlong =
  (direction, ...extents) =>
  (shape) => {
    const vector = shape.toCoordinate(direction);
    const heights = extents.map((extent) => Shape.toValue(extent, shape));
    if (heights.length % 2 === 1) {
      heights.push(0);
    }
    heights.sort((a, b) => a - b);
    const extrusions = [];
    while (heights.length > 0) {
      const height = heights.pop();
      const depth = heights.pop();
      if (height === depth) {
        // Return unextruded geometry at this height, instead.
        extrusions.push(shape.moveAlong(vector, height));
        continue;
      }
      extrusions.push(
        Shape.fromGeometry(
          extrudeGeometry(
            shape.toGeometry(),
            Point().moveAlong(vector, height).toGeometry(),
            Point().moveAlong(vector, depth).toGeometry()
          )
        )
      );
    }
    return Shape.Group(...extrusions);
  };

// Note that the operator is applied to each leaf geometry by default.
export const e = (...extents) => extrudeAlong(normal(), ...extents);

Shape.registerMethod('extrudeAlong', extrudeAlong);
Shape.registerMethod('e', e);

export default extrudeAlong;
