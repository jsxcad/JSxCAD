import Shape from './Shape.js';
import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';

export const move =
  (...args) =>
  (shape) =>
    Shape.Group(
      ...Shape.toCoordinates(shape, ...args).map((coordinate) =>
        shape.transform(fromTranslateToTransform(...coordinate))
      )
    );

export const xyz = move;

Shape.registerMethod('xyz', xyz);

Shape.registerMethod('move', move);

export default move;
