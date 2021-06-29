import { Shape, fromGeometry } from './Shape.js';
import { empty, union as unionGeometry } from '@jsxcad/geometry';

export const fuse = () => (shape) => {
  const geometry = shape.toGeometry();
  return fromGeometry(unionGeometry(empty({ tags: geometry.tags }), geometry));
};
Shape.registerMethod('fuse', fuse);
