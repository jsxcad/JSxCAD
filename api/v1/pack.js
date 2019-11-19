import Shape from './Shape';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack = (options = {}, ...shapes) => {
  const [packed, unpacked] = packAlgorithm(options, ...shapes.map(shape => shape.toKeptGeometry()));
  return [packed.map(geometry => Shape.fromGeometry(geometry)),
          unpacked.map(geometry => Shape.fromGeometry(geometry))];
};

export default pack;
