import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';

export const Group = Shape.registerShapeMethod('Group', async (...shapes) =>
  Shape.fromGeometry(
    taggedGroup(
      {},
      ...await Shape.toShapesGeometries(shapes)
    )
  ));

export default Group;
