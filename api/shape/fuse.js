import { Shape, fromGeometry } from './Shape.js';
import { fuse as fuseGeometry } from '@jsxcad/geometry';

export const fuse =
  () =>
  (...shapes) =>
    fromGeometry(
      fuseGeometry(Shape.toShapes(shapes).map((shape) => shape.toGeometry()))
    );

Shape.registerMethod('fuse', fuse);
