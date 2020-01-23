import Shape from '@jsxcad/api-v1-shape';
import { getLeafs } from '@jsxcad/geometry-tagged';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack = (shape, { size, pageMargin = 5, itemMargin = 1, perLayout = Infinity }) => {
  if (perLayout === 0) {
    // Packing was disabled -- do nothing.
    return shape;
  }

  let todo = [];
  for (const leaf of getLeafs(shape.toKeptGeometry())) {
    todo.push(leaf);
  }
  const packedLayers = [];
  while (true) {
    const [packed, unpacked] = packAlgorithm({ size, pageMargin, itemMargin }, ...todo.slice(0, perLayout));
    if (packed.length === 0) {
      break;
    } else {
      packedLayers.push({ item: { disjointAssembly: packed } });
    }
    if (unpacked.length === 0) {
      break;
    }
    todo = unpacked;
  }
  let packedShape;
  if (packedLayers.length === 1) {
    // This is a reasonably common case.
    packedShape = Shape.fromGeometry(packedLayers[0]);
  } else {
    packedShape = Shape.fromGeometry({ layers: packedLayers });
  }
  if (size === undefined) {
    packedShape = packedShape.center();
  }
  return packedShape;
};

const packMethod = function (...args) { return pack(this, ...args); };
Shape.prototype.pack = packMethod;

pack.signature = 'pack({ size, margin = 5 }, ...shapes:Shape) -> [packed:Shapes, unpacked:Shapes]';

export default pack;
