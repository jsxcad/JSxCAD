import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';

const toShapesGeometriesOp = Shape.ops.get('toShapesGeometries');

export const Group = Shape.registerShapeMethod('Group', async (...shapes) =>
  Shape.fromGeometry(
    taggedGroup({}, ...(await toShapesGeometriesOp(shapes)(null)))
  )
);

export default Group;
