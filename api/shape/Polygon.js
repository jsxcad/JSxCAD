import Face from './Face.js';
import Shape from './Shape.js';

export const Polygon = Shape.registerShapeMethod('Polygon', (...points) =>
  Face(...points)
);

export default Polygon;
