import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

export const Intersection = (first, ...rest) => first.clip(...rest);

export default Intersection;

Shape.prototype.Intersection = shapeMethod(Intersection);
