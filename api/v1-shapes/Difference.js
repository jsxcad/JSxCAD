import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

export const Difference = (first, ...rest) => first.cut(...rest);

export default Difference;

Shape.prototype.Difference = shapeMethod(Difference);
