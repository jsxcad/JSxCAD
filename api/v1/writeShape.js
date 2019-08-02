import { Shape } from './Shape';
import { toStandardGeometry } from '@jsxcad/geometry-tagged';
import { writeFile } from '@jsxcad/sys';

/**
 *
 * # Write Shape Geometry
 *
 * This writes a shape as a tagged geometry in json format.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * await Cube().writeShape('cube.shape');
 * await readShape({ path: 'cube.shape' })
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
  if (typeof options === 'string') {
    options = { path: options };
  }
  const { path, preview = true } = options;
  const geometry = toStandardGeometry(toGeometry(options, shape));
  await writeFile({ preview, geometry }, path, JSON.stringify(geometry));
};

const method = function (options = {}) { return writeShape(options, this); };

Shape.prototype.writeShape = method;
