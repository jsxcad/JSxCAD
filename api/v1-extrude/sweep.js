import { Shape, assemble } from '@jsxcad/api-v1-shape';

import Hull from './Hull.js';
import { getEdges } from '@jsxcad/geometry-path';
import { getPaths } from '@jsxcad/geometry-tagged';

/**
 *
 * # Sweep
 *
 * Sweep a tool profile along a path, to produce a surface.
 *
 **/

// FIX: This is a weak approximation assuming a 1d profile -- it will need to be redesigned.
export const sweep = (toolpath, tool) => {
  const chains = [];
  for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
    for (const path of paths) {
      chains.push(
        ...getEdges(path).map(([start, end]) =>
          Hull(tool.move(...start), tool.move(...end))
        )
      );
    }
  }
  return assemble(...chains);
};

const sweepMethod = function (tool) {
  return sweep(this, tool);
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool) {
  return assemble(this, sweep(this, tool));
};

export default sweep;
