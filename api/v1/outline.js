import { Shape } from './Shape';
import { getZ0Surfaces } from '@jsxcad/geometry-eager';
import { union } from '@jsxcad/geometry-z0surface';

export const outline = (options = {}, shape) => {
  // FIX: Handle non-z0surfaces.
  return Shape.fromPaths(union(...getZ0Surfaces(shape.toGeometry())));
};

const method = function (options) { return outline(options, this); };

Shape.prototype.outline = method;
