import { Shape, assemble } from '@jsxcad/api-v1-shape';

import { overcut as overcutAlgorithm } from '@jsxcad/algorithm-toolpath';

// Return an assembly of paths so that each toolpath can have its own tag.
export const toolpath = (
  shape,
  radius = 1,
  { overcut = 0, joinPaths = false } = {}
) =>
  Shape.fromGeometry({
    type: 'paths',
    paths: overcutAlgorithm(
      shape.outline().toKeptGeometry(),
      radius,
      overcut,
      joinPaths
    ),
  });

const method = function (...options) {
  return toolpath(this, ...options);
};

Shape.prototype.toolpath = method;
Shape.prototype.withToolpath = function (...args) {
  return assemble(this, toolpath(this, ...args));
};

export default toolpath;
