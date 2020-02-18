import Shape from './jsxcad-api-v1-shape.js';
import { getLeafs } from './jsxcad-geometry-tagged.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';

const pack = (shape, { size, pageMargin = 5, itemMargin = 1, perLayout = Infinity, packSize = [] }) => {
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
    const [packed, unpacked, minPoint, maxPoint] = pack$1({ size, pageMargin, itemMargin }, ...input);
    packSize[0] = minPoint;
    packSize[1] = maxPoint;
    if (packed.length === 0) {
      break;
    } else {
      packedLayers.push({ item: { disjointAssembly: packed } });
    }
    todo.unshift(...unpacked);
  }
  let packedShape = Shape.fromGeometry({ layers: packedLayers });
  if (size === undefined) {
    packedShape = packedShape.center();
  }
  return packedShape;
};

const packMethod = function (...args) { return pack(this, ...args); };
Shape.prototype.pack = packMethod;

pack.signature = 'pack({ size, margin = 5 }, ...shapes:Shape) -> [packed:Shapes, unpacked:Shapes]';

const api = {
  pack
};

export default api;
export { pack };
