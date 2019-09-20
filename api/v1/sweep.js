import { Circle } from './Circle';
import { Shape } from './Shape';
import { chainHull } from './chainHull';
import { getPaths } from '@jsxcad/geometry-tagged';
import { union } from './union';

/**
 *
 * # Sweep
 *
 * Sweep a tool profile along a path, to produce a surface.
 *
 **/

// FIX: This is a weak approximation assuming a 1d profile -- it will need to be redesigned.
export const sweep = (tool, ...toolpaths) => {
  const chains = [];
  for (const toolpath of toolpaths) {
    for (const { paths } of getPaths(toolpath.toKeptGeometry())) {
      for (const path of paths) {
        chains.push(chainHull(...path.map(point => tool.move(point))));
      }
    }
  }
  return union(...chains);
}

const method = function (...toolpaths) { return sweep(this, ...toolpaths); };

Shape.prototype.sweep = method;
