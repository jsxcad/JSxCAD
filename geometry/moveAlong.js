import { add, length, scale } from './vector.js';

import { Group } from './Group.js';
import { computeNormalCoordinate } from './computeNormal.js';
import { translate } from './translate.js';

export const moveAlong = (geometry, direction, deltas) => {
  const moves = [];
  for (const delta of deltas) {
    moves.push(translate(geometry, scale(delta, direction)));
  }
  return Group(moves);
};

export const moveAlongNormal = (geometry, deltas) =>
  moveAlong(geometry, computeNormalCoordinate(geometry), deltas);

export const moveCoordinateAlong = (coordinate, direction, delta) => {
  const unitDirection = scale(1 / length(direction), direction);
  const distance = scale(delta, unitDirection);
  const result = add(coordinate, distance);
  return result;
};
