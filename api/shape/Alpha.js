import { alphaShape, eachPoint } from '@jsxcad/geometry';

import { Shape } from './Shape.js';

export const Alpha = (componentLimit = 1, shape) => {
  const points = [];
  eachPoint((point) => points.push(point), shape.toGeometry());
  return Shape.fromGeometry(
    alphaShape({ tags: shape.toGeometry().tags }, points, componentLimit)
  );
};

const alpha =
  (componentLimit = 1) =>
  (shape) =>
    Alpha(componentLimit, shape);

Shape.registerMethod('alpha', alpha);

export default Alpha;
