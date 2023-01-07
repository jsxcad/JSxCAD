import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';
import { toNestedValues } from './toNestedValues.js';

export const Segments = Shape.registerMethod(
  'Segments',
  (segments = []) =>
    async (shape) => {
      const coordinates = [];
      for (const [source, target] of await toNestedValues(segments)(shape)) {
        coordinates.push([
          await toCoordinate(source)(shape),
          await toCoordinate(target)(shape),
        ]);
      }
      return Shape.fromSegments(coordinates);
    }
);

export default Segments;
