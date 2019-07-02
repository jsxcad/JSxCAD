import { Shape } from './Shape';
import { getSolids } from '@jsxcad/geometry-tagged';

/**
 *
 * # Describe
 *
 * Provides statistics about an object.
 *
 **/

export const describe = (shape) => {
  const kept = shape.toKeptGeometry();
  const descriptions = [];
  for (const { solid } of getSolids(kept)) {
    descriptions.push({ solid: { surface: { count: solid.length } } });
  }
  return descriptions;
};

const method = function (...params) { return describe(...params, this); };
Shape.prototype.describe = method;
