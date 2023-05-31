import Shape from './Shape.js';

export const Segments = Shape.registerMethod2(
  'Segments',
  ['coordinateLists'],
  (coordinateLists) => Shape.fromSegments(coordinateLists)
);

export default Segments;
