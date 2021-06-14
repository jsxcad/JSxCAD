import Shape from '@jsxcad/api-v1-shape';
import { extrude as extrudeGeometry } from '@jsxcad/geometry';

export const extrude = (shape, ...heights) => {
  if (heights.length % 2 === 1) {
    heights.push(0);
  }
  heights.sort();
  const extrusions = [];
  while (heights.length > 0) {
    let height = heights.pop();
    let depth = heights.pop();
    if (height === depth) {
      // Return unextruded geometry at this height, instead.
      extrusions.push(shape.z(height));
      continue;
    }
    if (height < depth) {
      [height, depth] = [depth, height];
    }
    extrusions.push(Shape.fromGeometry(extrudeGeometry(shape.toGeometry(), height, depth)));
  }
  return Shape.Group(...extrusions);
};

const extrudeMethod = function (...heights) {
  return extrude(this, ...heights);
};
Shape.prototype.extrude = extrudeMethod;
Shape.prototype.pull = extrudeMethod;
Shape.prototype.ex = extrudeMethod;

export default extrude;
