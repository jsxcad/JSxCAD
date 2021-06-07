import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { fromFunctionToGraph } from '@jsxcad/geometry';

export const Implicit = (op, options) =>
  Shape.fromGraph(fromFunctionToGraph(op, options));

Shape.prototype.Implicit = shapeMethod(Implicit);

export default Implicit;
