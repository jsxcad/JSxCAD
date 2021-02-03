import { Shape, fromGeometry } from './Shape.js';
import { empty, union as unionGeometry } from '@jsxcad/geometry-tagged';

export const fuse = (shape) => {
  const geometry = shape.toGeometry();
  return fromGeometry(unionGeometry(empty({ tags: geometry.tags }), geometry));
};

const fuseMethod = function (...shapes) {
  return fuse(this);
};
Shape.prototype.fuse = fuseMethod;

export default fuse;
