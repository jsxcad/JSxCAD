import Shape from './Shape.js';
import { toCoordinates } from './toCoordinates.js';

export const Face = Shape.registerShapeMethod('Face', async (...points) => {
  const coordinates = await toCoordinates(points)(null);
  return Shape.fromPolygons([{ points: coordinates }]);
});

export default Face;
