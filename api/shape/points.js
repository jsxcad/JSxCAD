import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { eachPoint } from '@jsxcad/geometry';

export const points =
  (op = Point, group = Group) =>
  (shape) => {
    const results = [];
    eachPoint((point) => results.push(op(point)), shape.toGeometry());
    return group(...results);
  };

Shape.registerMethod('points', points);
