import { Surface } from './Surface';
import { Solid } from './Solid';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height }, surface) => extrudeLinear({ height: height }, surface);

Surface.prototype.extrude = function (options = {}) {
  return Surface.fromPolygons(extrude(options, this.toPaths()));
};
