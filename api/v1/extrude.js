import { CAG } from './CAG';
import { CSG } from './CSG';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height }, surface) => extrudeLinear({ height: height }, surface);

CAG.prototype.extrude = function (options = {}) {
  return CSG.fromPolygons(extrude(options, this.toPaths()));
};
