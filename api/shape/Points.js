import Shape from './Shape.js';

export const Points = Shape.registerMethod2(
  'Points',
  ['coordinateLists'],
  (coordinatesLists) => {
    const [coordinatesList = []] = coordinatesLists;
    return Shape.fromPoints(coordinatesList);
  }
);

export default Points;
