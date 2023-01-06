import Face from './Face.js';
import Shape from './Shape.js';

export const Polygon = Shape.registerMethod(
  'Polygon',
  (...points) =>
    async (shape) =>
      Face(...points)(shape)
);

export default Polygon;
