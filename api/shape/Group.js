import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Group = Shape.registerMethod(
  'Group',
  (...shapes) =>
    async (shape) => {
      for (const item of shapes) {
        if (item instanceof Promise) {
          throw Error(`Group/promise: ${JSON.stringify(await item)}`);
        }
      }
      return Shape.fromGeometry(
        taggedGroup({}, ...(await toShapesGeometries(shapes)(shape)))
      );
    }
);

export default Group;
