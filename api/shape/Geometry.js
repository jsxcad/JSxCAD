import Shape from './Shape.js';

export const Geometry = Shape.registerMethod(
  'Geometry',
  (geometry) => async (shape) => {
    return Shape.chain(Shape.fromGeometry(geometry));
  }
);

export default Geometry;
