import './toCoordinate.js';
import './toNestedValues.js';

import Shape from './Shape.js';

const toNestedValuesOp = Shape.ops.get('toNestedValues');
const toCoordinateOp = Shape.ops.get('toCoordinate');

export const Edges = Shape.registerShapeMethod('Edges', async (arg) => {
  const segments = [];
  for (const [source, target] of await toNestedValuesOp(arg)(null)) {
    segments.push([await toCoordinateOp(source)(null), await toCoordinateOp(target)(null)]);
  }
  return Shape.fromSegments(segments);
});

export default Edges;
