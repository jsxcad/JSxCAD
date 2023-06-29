import { Group } from './Group.js';
import { computeNormalCoordinates } from './computeNormal.js';
import { translate } from './translate.js';

const add = ([aX = 0, aY = 0, aZ = 0], [bX = 0, bY = 0, bZ = 0]) => [
  aX + bX,
  aY + bY,
  aZ + bZ,
];

const length = ([x = 0, y = 0, z = 0]) => Math.sqrt(x * x + y * y + z * z);

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

export const moveAlong = (geometry, direction, deltas) => {
  const moves = [];
  for (const delta of deltas) {
    moves.push(translate(geometry, scale(delta, direction)));
  }
  return Group(moves);
};

export const moveAlongNormal = (geometry, deltas) =>
  moveAlong(geometry, computeNormalCoordinates(geometry), deltas);

export const moveCoordinateAlong = (coordinate, direction, delta) => {
  const unitDirection = scale(1 / length(direction), direction);
  const distance = scale(delta, unitDirection);
  const result = add(coordinate, distance);
  return result;
};
