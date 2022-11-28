import './toCoordinate.js';
import Shape from './Shape.js';

const toCoordinateOp = Shape.ops.get('toCoordinate');

export const Point = Shape.registerShapeMethod('Point', async (...args) =>
  Shape.fromPoint(await toCoordinateOp(...args)())
);

export default Point;
