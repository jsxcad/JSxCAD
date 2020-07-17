import Hull from './Hull.js';
import { Layers } from '@jsxcad/api-v1-shapes';
import { Shape } from '@jsxcad/api-v1-shape';
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
  return Layers(...chains).Item('sweep');
};

const sweepMethod = function (tool) {
  return sweep(this, tool);
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool) {
  return this.with(sweep(this, tool));
};

export default sweep;
