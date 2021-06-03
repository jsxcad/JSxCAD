import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedAssembly } from '@jsxcad/geometry';

const isDefined = (value) => value !== undefined;

export const Assembly = (...shapes) =>
  Shape.fromGeometry(
    taggedAssembly(
      {},
      ...shapes.filter(isDefined).map((shape) => shape.toGeometry())
    )
  );

export default Assembly;

Shape.prototype.Assembly = shapeMethod(Assembly);
