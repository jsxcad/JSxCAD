import Shape from './Shape.js';

import { fromFunctionToGraph } from '@jsxcad/geometry';

export const Implicit = (op, options) =>
  Shape.fromGraph(fromFunctionToGraph(op, options));

Shape.prototype.Implicit = Shape.shapeMethod(Implicit);

export default Implicit;
