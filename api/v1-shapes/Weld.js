import { Shape, shapeMethod, weld } from '@jsxcad/api-v1-shape';

export const Weld = (...shapes) => weld(...shapes);

Shape.prototype.Weld = shapeMethod(Weld);

export default Weld;
