import { Shape, fromGeometry } from './Shape.js';
import { destructure } from './destructure.js';
import { fuse as fuseGeometry } from '@jsxcad/geometry';

export const fuse = Shape.chainable((...args) => (shape) => {
  const { strings: modes } = destructure(args);
  return fromGeometry(
    fuseGeometry(shape.toGeometry(), modes.includes('exact'))
  );
});

Shape.registerMethod('fuse', fuse);
