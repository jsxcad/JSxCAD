import Shape from './Shape.js';
import { fromTranslation } from '@jsxcad/math-mat4';

export const move =
  (...args) =>
  (shape) =>
    Shape.Group(
      ...Shape.toCoordinates(...args).map((coordinate) =>
        shape.transform(fromTranslation(coordinate))
      )
    );

export const xyz = move;

Shape.registerMethod('xyz', xyz);

Shape.registerMethod('move', move);

export default move;
