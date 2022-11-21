import { getLeafs, taggedGroup, taggedItem } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { align } from './align.js';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack = Shape.registerMethod(
  'pack',
  ({
      size,
      pageMargin = 5,
      itemMargin = 1,
      perLayout = Infinity,
      packSize = [],
    } = {}) =>
    async (shape) => {
      if (perLayout === 0) {
        // Packing was disabled -- do nothing.
        console.log(`QQ/packed/early: ${JSON.stringify(shape)}`);
        return shape;
      }

      let todo = [];
      for (const leaf of getLeafs(await shape.toGeometry())) {
        todo.push(leaf);
      }
      const packedLayers = [];
      while (todo.length > 0) {
        const input = [];
        while (todo.length > 0 && input.length < perLayout) {
          input.push(todo.shift());
        }
        const [packed, unpacked, minPoint, maxPoint] = packAlgorithm(
          { size, pageMargin, itemMargin },
          ...input
        );
        if (minPoint.every(isFinite) && maxPoint.every(isFinite)) {
          // CHECK: Why is this being overwritten by each pass?
          packSize[0] = minPoint;
          packSize[1] = maxPoint;
          if (packed.length === 0) {
            break;
          } else {
            console.log(`QQ/packed: ${JSON.stringify(packed)}`);
            packedLayers.push(
              taggedItem(
                { tags: ['pack:layout'] },
                taggedGroup({}, ...packed) // .map(shape => shape.toGeometry())
              )
            );
          }
          todo.unshift(...unpacked);
        }
      }
      // CHECK: Can this distinguish between a set of packed paged, and a single
      // page that's packed?
      let packedShape = Shape.fromGeometry(taggedGroup({}, ...packedLayers));
      if (size === undefined) {
        packedShape = packedShape.by(align('xy'));
      }
      console.log(
        `QQ/packed: ${JSON.stringify(packedShape)} ${packedShape.isChain}`
      );
      return packedShape;
    }
);

export default pack;
