import { Shape, assemble, union } from '@jsxcad/api-v1-shape';

import ChainedHull from './ChainedHull.js';
import { getPaths } from '@jsxcad/geometry-tagged';
import { isOpen } from '@jsxcad/geometry-path';

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
      if (isOpen(path)) {
        chains.push(
          ChainedHull(...path.slice(1).map((point) => tool.move(...point)))
        );
      } else {
        chains.push(ChainedHull(...path.map((point) => tool.move(...point))));
      }
    }
  }
  return union(...chains);
};

const sweepMethod = function (tool) {
  return sweep(this, tool);
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool) {
  return assemble(this, sweep(this, tool));
};

export default sweep;
