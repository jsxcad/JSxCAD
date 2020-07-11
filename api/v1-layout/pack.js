import {
  getLeafs,
  taggedDisjointAssembly,
  taggedItem,
  taggedLayers,
  toDisjointGeometry,
} from '@jsxcad/geometry-tagged';

import Shape from '@jsxcad/api-v1-shape';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack = (
  shape,
  { size, pageMargin = 5, itemMargin = 1, perLayout = Infinity, packSize = [] }
) => {
  if (perLayout === 0) {
    // Packing was disabled -- do nothing.
    return shape;
  }

  let todo = [];
  for (const leaf of getLeafs(shape.toKeptGeometry())) {
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
        taggedItem(
          {},
          taggedDisjointAssembly({}, ...packed.map(toDisjointGeometry))
        )
      );
    }
    todo.unshift(...unpacked);
  }
  let packedShape = Shape.fromGeometry(taggedLayers({}, ...packedLayers));
  if (size === undefined) {
    packedShape = packedShape.center({
      centerX: true,
      centerY: true,
      centerZ: false,
    });
  }
  return packedShape;
};

const packMethod = function (...args) {
  return pack(this, ...args);
};
Shape.prototype.pack = packMethod;

export default pack;
