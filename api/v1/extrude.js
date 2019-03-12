import { CAG } from './CAG';
import { CSG } from './CSG';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height }, paths) => {
  return extrudeLinear({ height: height }, paths);
};

CAG.prototype.extrude = function (options = {}) {
  return CSG.fromPolygons(extrude(options, this.toPaths()));
};
