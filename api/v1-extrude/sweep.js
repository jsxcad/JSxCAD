import { Group } from '@jsxcad/api-v1-shapes';
import { Hull } from './Hull.js';
import { Shape } from '@jsxcad/api-v1-shape';
import { getEdges } from '@jsxcad/geometry-path';
import { getPaths } from '@jsxcad/geometry-tagged';

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
  return Group(...chains);
};

const sweepMethod = function (tool, { resolution = 1 } = {}) {
  return sweep(this, tool, { resolution });
};

Shape.prototype.sweep = sweepMethod;
Shape.prototype.withSweep = function (tool, { resolution }) {
  return this.with(sweep(this, tool, { resolution }));
};

export default sweep;
