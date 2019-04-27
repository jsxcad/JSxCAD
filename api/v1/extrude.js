import { Z0Surface } from './Z0Surface';
import { Solid } from './Solid';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height }, surface) => extrudeLinear({ height: height }, surface);

Z0Surface.prototype.extrude = function (options = {}) {
  return Z0Surface.fromPolygons(extrude(options, this.toPaths()));
};
