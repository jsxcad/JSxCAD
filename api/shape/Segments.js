import Shape from './Shape.js';

export const Segments = Shape.registerMethod2(
  'Segments',
  ['segments'],
  (segments) => Shape.fromSegments(segments)
);

export default Segments;
