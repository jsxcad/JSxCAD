import { alphaShape, taggedGraph } from '@jsxcad/geometry';
import { Shape } from './Shape.js';

export const Alpha =
  (componentLimit = 1) =>
  (shape) => {
    const points = [];
    shape.eachPoint((point) => points.push(point));
    return Shape.fromGeometry(
      taggedGraph({}, alphaShape(points, componentLimit))
    );
  };

const alpha =
  (componentLimit = 1) =>
  (shape) =>
    Alpha(shape, componentLimit);

Shape.registerMethod('alpha', alpha);

export default Alpha;
