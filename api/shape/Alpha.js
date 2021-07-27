import { Shape } from './Shape.js';
import { alphaShape } from '@jsxcad/geometry';

export const Alpha = (componentLimit = 1, shape) => {
  const points = [];
  shape.eachPoint((point) => points.push(point));
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
