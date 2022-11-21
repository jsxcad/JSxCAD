import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';
import { toNestedValues } from './toNestedValues.js';

export const Segments = Shape.registerShapeMethod(
  'Segments',
  async (segments = []) => {
    const coordinates = [];
    for (const [source, target] of await toNestedValues(segments)(null)) {
      coordinates.push([
        await toCoordinate(source)(null),
        await toCoordinate(target)(null),
      ]);
    }
    return Shape.fromSegments(coordinates);
  }
);

export default Segments;
