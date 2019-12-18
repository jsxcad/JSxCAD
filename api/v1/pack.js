import Shape from './Shape';
import { pack as packAlgorithm } from '@jsxcad/algorithm-pack';

export const pack = ({ size = [210, 297], margin = 5 }, ...shapes) => {
  const [packed, unpacked] = packAlgorithm({ size, margin }, ...shapes.map(shape => shape.toKeptGeometry()));
  return [packed.map(geometry => Shape.fromGeometry(geometry)),
          unpacked.map(geometry => Shape.fromGeometry(geometry))];
};

export default pack;

pack.signature = 'pack({ size, margin = 5 }, ...shapes:Shape) -> [packed:Shapes, unpacked:Shapes]';
