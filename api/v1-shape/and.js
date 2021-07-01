import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const and =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      taggedGroup(
        {},
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('and', and);

export default and;
