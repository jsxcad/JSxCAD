import Shape from './Shape.js';

export const Points = Shape.registerShapeMethod('Points', (points) =>
  Shape.fromPoints(points.map((arg) => Shape.toCoordinate(undefined, arg)))
);

export default Points;
