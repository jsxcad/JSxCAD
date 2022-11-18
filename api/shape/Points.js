import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Points = Shape.registerShapeMethod('Points', async (points) => {
  const coordinates = [];
  for (const point of points) {
    coordinates.push(await toCoordinate(point)(null));
  }
  return Shape.fromPoints(coordinates);
});

export default Points;
