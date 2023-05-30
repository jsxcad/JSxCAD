import Shape from './Shape.js';

export const Segments = Shape.registerMethod(
  'Segments',
  ['coordinateLists'],
  async (coordinateLists) => Shape.fromSegments(coordinateLists)
);

export default Segments;
