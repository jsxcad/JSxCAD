import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedGroup } from '@jsxcad/geometry';

const isDefined = (value) => value;

export const Group = (...shapes) =>
  Shape.fromGeometry(
    taggedGroup(
      {},
      ...shapes.filter(isDefined).map((shape) => shape.toGeometry())
    )
  );

Shape.prototype.Group = shapeMethod(Group);
Shape.Group = Group;

export default Group;
