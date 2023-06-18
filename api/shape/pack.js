import { getLeafs, taggedGroup, taggedItem } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack = Shape.registerMethod2(
  'pack',
  ['input', 'function', 'options'],
  async (
    input,
    adviseSize = (min, max) => {},
    { size, pageMargin = 5, itemMargin = 1, perLayout = Infinity } = {}
  ) => {
    if (perLayout === 0) {
      // Packing was disabled -- do nothing.
      return input;
    }

    let todo = [];
    for (const leaf of getLeafs(await input.toGeometry())) {
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
        adviseSize(minPoint, maxPoint);
        if (packed.length === 0) {
          break;
        } else {
          packedLayers.push(
            taggedItem({ tags: ['pack:layout'] }, taggedGroup({}, ...packed))
          );
        }
        todo.unshift(...unpacked);
      }
    }
    // CHECK: Can this distinguish between a set of packed paged, and a single
    // page that's packed?
    let packedShape = Shape.fromGeometry(taggedGroup({}, ...packedLayers));
    if (size === undefined) {
      packedShape = await packedShape.align('xy');
    }
    return packedShape;
  }
);

export default pack;
