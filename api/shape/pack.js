import {
  getLeafs,
  taggedGroup,
  taggedItem,
  toTransformedGeometry,
} from '@jsxcad/geometry';

import Shape from './Shape.js';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack =
  ({
    size,
    pageMargin = 5,
    itemMargin = 1,
    perLayout = Infinity,
    packSize = [],
  } = {}) =>
  (shape) => {
    if (perLayout === 0) {
      // Packing was disabled -- do nothing.
      return shape;
    }

    let todo = [];
    for (const leaf of getLeafs(shape.toTransformedGeometry())) {
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
      packSize[0] = minPoint;
      packSize[1] = maxPoint;
      if (packed.length === 0) {
        break;
      } else {
        packedLayers.push(
          taggedItem({}, taggedGroup({}, ...packed.map(toTransformedGeometry)))
        );
      }
      todo.unshift(...unpacked);
    }
    let packedShape = Shape.fromGeometry(taggedGroup({}, ...packedLayers));
    if (size === undefined) {
      packedShape = packedShape.align('xy');
    }
    return packedShape;
  };

Shape.registerMethod('pack', pack);

export default pack;
