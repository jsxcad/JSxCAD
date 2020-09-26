import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedLayers } from '@jsxcad/geometry-tagged';

const isDefined = (value) => value;

export const Group = (...shapes) =>
  Shape.fromGeometry(
    taggedLayers(
      {},
      ...shapes.filter(isDefined).map((shape) => shape.toGeometry())
    )
  );

Shape.prototype.Group = shapeMethod(Group);

export default Group;
