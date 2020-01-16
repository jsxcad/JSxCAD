import { getItems, toKeptGeometry } from './jsxcad-geometry-tagged.js';
import Shape from './jsxcad-api-v1-shape.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';

const pack = (shape, { size = [210, 297], margin = 5 }) => {
  let items = [];
  for (const item of getItems(shape.toKeptGeometry())) {
    items.push(toKeptGeometry(item));
  }
  const packs = [];
  while (true) {
    const [packed, unpacked] = pack$1({ size, margin }, ...items);
    if (packed.length === 0) {
      break;
    } else {
      packs.push({ item: { layers: packed } });
    }
    if (unpacked.length === 0) {
      break;
    }
    items = unpacked;
  }
  return Shape.fromGeometry({ layers: packs });
};

const packMethod = function (...args) { return pack(this, ...args); };
Shape.prototype.pack = packMethod;

pack.signature = 'pack({ size, margin = 5 }, ...shapes:Shape) -> [packed:Shapes, unpacked:Shapes]';

const api = {
  pack
};

export default api;
export { pack };
