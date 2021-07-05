import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';

const isDefined = (value) => value;

export const Group = (...shapes) =>
  Shape.fromGeometry(
    taggedGroup(
      {},
      ...shapes.filter(isDefined).map((shape) => shape.toGeometry())
    )
  );

Shape.prototype.Group = Shape.shapeMethod(Group);
Shape.Group = Group;

export default Group;
