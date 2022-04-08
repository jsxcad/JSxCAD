import Face from './Face.js';
import Shape from './Shape.js';

export const Polygon = (...points) => Face(...points);

export default Polygon;

Shape.prototype.Polygon = Shape.shapeMethod(Polygon);
