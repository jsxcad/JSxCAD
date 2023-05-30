import Shape from './Shape.js';

export const Points = Shape.registerMethod2(
  'Points',
  ['coordinateLists'],
  (coordinateLists) => {
    const [coordinateList] = coordinateLists;
    return Shape.fromPoints(coordinateList);
  }
);

export default Points;
