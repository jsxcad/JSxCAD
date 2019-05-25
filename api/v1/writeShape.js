import { Shape } from './Shape';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write Shape Geometry
 *
 * This writes a shape as a tagged geometry in json format.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * writeShape({ path: 'cube.shape' }, cube())
 * readShape({ path: 'cube.shape' })
 * ```
 * :::
 *
 **/

const toGeometry = ({ disjoint = true }, shape) => {
  if (disjoint) {
    return shape.toDisjointGeometry();
  } else {
    return shape.toGeometry();
  }
};

export const writeShape = async (options, shape) => {
  const { path, preview = true } = options;
  const geometry = toGeometry(options, shape);
  return writeFile({ preview, geometry }, path, JSON.stringify(geometry));
};

const method = function (options = {}) { writeShape(options, this); return this; };

Shape.prototype.writeShape = method;
