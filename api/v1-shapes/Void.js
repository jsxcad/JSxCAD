import Shape from '@jsxcad/api-v1-shape';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const Void = (shape) => Shape.fromGeometry(rewriteTags(['compose/non-positive'], [], shape.toGeometry()));

const VoidMethod = function () { return Void(this); };
Shape.prototype.Void = VoidMethod;

export default Void;
