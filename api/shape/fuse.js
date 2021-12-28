import { Shape, fromGeometry } from './Shape.js';
import { empty, union as unionGeometry } from '@jsxcad/geometry';

export const fuse = ({ isPlanar } = {}) => (shape) => {
  const geometry = shape.toGeometry();
  return fromGeometry(unionGeometry(empty({ tags: geometry.tags, isPlanar }), geometry));
};
Shape.registerMethod('fuse', fuse);
