import { Shape } from './Shape';
import { assemble } from './assemble';
import { chainHull } from './chainHull';
import { getPaths } from '@jsxcad/geometry-tagged';
import union from './union';

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
      chains.push(chainHull(...path.map(point => tool.move(...point))));
    }
  }
  return union(...chains);
};

const method = function (tool) { return sweep(this, tool); };

Shape.prototype.sweep = method;
Shape.prototype.withSweep = function (tool) { return assemble(this, sweep(this, tool)); };
