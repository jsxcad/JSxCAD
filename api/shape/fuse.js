import { Shape, fromGeometry } from './Shape.js';
import { fuse as fuseGeometry } from '@jsxcad/geometry';

export const fuse = () => (shape) =>
  fromGeometry(fuseGeometry(shape.toGeometry()));

Shape.registerMethod('fuse', fuse);
