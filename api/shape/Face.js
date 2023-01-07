import Shape from './Shape.js';
import { toCoordinates } from './toCoordinates.js';

export const Face = Shape.registerMethod(
  'Face',
  (...points) =>
    async (shape) => {
      const coordinates = await toCoordinates(points)(shape);
      return Shape.fromPolygons([{ points: coordinates }]);
    }
);

export default Face;
