import Shape from './Shape.js';

export const Points = Shape.registerMethod2(
  'Points',
  ['coordinateLists'],
  ([coordinateList]) =>
    Shape.fromPoints(coordinateList);
);

export default Points;
