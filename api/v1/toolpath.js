import { Shape } from './Shape';
import { assemble } from './assemble';
import { overcut } from '@jsxcad/algorithm-toolpath';

// Return an assembly of paths so that each toolpath can have its own tag.
export const toolpath = (shape, radius = 1, ...options) =>
  Shape.fromGeometry({ paths: overcut(shape.outline().toKeptGeometry(), radius, ...options) });

const method = function (...options) { return toolpath(this, ...options); };

Shape.prototype.toolpath = method;
Shape.prototype.withToolpath = function (...options) { return assemble(this, toolpath(this, ...options)); };
