import { CAG } from './CAG';
import { CSG } from './CSG';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height }, surface) => {
console.log(`QQ/extrude: ${JSON.stringify(surface)}`);
  const extrusion = extrudeLinear({ height: height }, surface);
console.log(`QQ/extrusion: ${JSON.stringify(extrusion)}`);
  return extrusion;
};

CAG.prototype.extrude = function (options = {}) {
  return CSG.fromPolygons(extrude(options, this.toPaths()));
};
