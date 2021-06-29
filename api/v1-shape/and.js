import Shape from './Shape.js';
import { taggedLayers } from '@jsxcad/geometry';

export const and =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      taggedLayers(
        {},
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('and', and);

export default and;
