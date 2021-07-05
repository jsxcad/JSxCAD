import Shape from './Shape.js';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';

export const extrude =
  (...heights) =>
  (shape) => {
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
        extrusions.push(shape.z(height));
        continue;
      }
      extrusions.push(
        Shape.fromGeometry(extrudeGeometry(shape.toGeometry(), height, depth))
      );
    }
    return Shape.Group(...extrusions);
  };

export const ex = extrude;

Shape.registerMethod('extrude', extrude);
Shape.registerMethod('ex', extrude);

export default extrude;
