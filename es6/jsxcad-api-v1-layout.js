import Shape from './jsxcad-api-v1-shape.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';

const pack = ({ size = [210, 297], margin = 5 }, ...shapes) => {
  const [packed, unpacked] = pack$1({ size, margin }, ...shapes.map(shape => shape.toKeptGeometry()));
  return [packed.map(geometry => Shape.fromGeometry(geometry)),
          unpacked.map(geometry => Shape.fromGeometry(geometry))];
};

pack.signature = 'pack({ size, margin = 5 }, ...shapes:Shape) -> [packed:Shapes, unpacked:Shapes]';

const api = {
  pack
};

export default api;
export { pack };
