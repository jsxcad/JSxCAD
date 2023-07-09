import Shape from './Shape.js';

export const Geometry = Shape.registerMethod3(
  'Geometry',
  ['rest'],
  ([geometry]) => geometry
);

export default Geometry;
