import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';
import { toNestedValues } from './toNestedValues.js';

export const Edges = Shape.registerMethod('Edges', (arg) => async (shape) => {
  const segments = [];
  for (const [source, target] of await toNestedValues(arg)(shape)) {
    segments.push([
      await toCoordinate(source)(shape),
      await toCoordinate(target)(shape),
    ]);
  }
  return Shape.fromSegments(segments);
});

export default Edges;
