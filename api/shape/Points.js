import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Points = Shape.registerMethod(
  'Points',
  (points) => async (shape) => {
    const coordinates = [];
    for (const point of points) {
      coordinates.push(await toCoordinate(point)(shape));
    }
    return Shape.fromPoints(coordinates);
  }
);

export default Points;
