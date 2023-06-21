import Shape from './Shape.js';

export const Geometry = Shape.registerMethod2(
  'Geometry',
  ['rest'],
  ([geometry]) => Shape.chain(Shape.fromGeometry(geometry))
);

export default Geometry;
