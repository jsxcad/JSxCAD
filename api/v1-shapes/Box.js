import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import {
  getBack,
  getCenter,
  getFront,
  getLeft,
  getRight,
} from '@jsxcad/geometry-plan';

import { orRadius } from './orRadius.js';

export const Box = (value = 1) => {
  const plan = orRadius(value);
  const left = getLeft(plan);
  const right = getRight(plan);
  const front = getFront(plan);
  const back = getBack(plan);
  const [, , Z] = getCenter(plan);
  return Shape.fromPath([
    [left, back, Z],
    [right, back, Z],
    [right, front, Z],
    [left, front, Z],
  ]);
};

Shape.prototype.Box = shapeMethod(Box);

export default Box;
