import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';

export const Group = (...shapes) =>
  Shape.fromGeometry(
    taggedGroup(
      {},
      ...Shape.toShapes(shapes).map((shape) => shape.toGeometry())
    )
  );

Shape.prototype.Group = Shape.shapeMethod(Group);
Shape.Group = Group;

export default Group;
