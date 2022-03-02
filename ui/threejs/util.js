import { Vector3 } from '@jsxcad/algorithm-threejs';

const round = (value, resolution) =>
  Math.round(value / resolution) * resolution;

export const getWorldPosition = (object, resolution = 0.01) => {
  const vector = new Vector3();
  object.getWorldPosition(vector);
  return [
    round(vector.x, resolution),
    round(vector.y, resolution),
    round(vector.z, resolution),
  ];
};
