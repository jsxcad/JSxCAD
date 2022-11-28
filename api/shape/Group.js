import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

// const toShapesGeometriesOp = Shape.ops.get('toShapesGeometries');

export const Group = Shape.registerShapeMethod('Group', async (...shapes) => {
  for (const item of shapes) {
    if (item instanceof Promise) {
      throw Error(`Group/promise: ${JSON.stringify(await item)}`);
    }
  }
  return Shape.fromGeometry(
    taggedGroup({}, ...(await toShapesGeometries(shapes)(null)))
  );
});

export default Group;
