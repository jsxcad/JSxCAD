import Shape from './Shape.js';

export const Points = Shape.registerMethod2(
  'Points',
  ['coordinateLists', 'coordinates'],
  (coordinateLists = [], coordinates = []) => {
    const coords = [];
    for (const coordinateList of coordinateLists) {
      for (const coordinate of coordinateList) {
        coords.push(coordinate);
      }
    }
    for (const coordinate of coordinates) {
      coords.push(coordinate);
    }
    return Shape.fromPoints(coords);
  }
);

export default Points;
