import Shape from './Shape.js';
import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';

export const move = Shape.registerMethod(['move', 'xyz'],
  (...args) =>
    (shape) =>
      Shape.Group(
        ...Shape.toCoordinates(shape, ...args).map((coordinate) =>
          shape.transform(fromTranslateToTransform(...coordinate))
        )
      )
);

export const xyz = move;

export default move;
