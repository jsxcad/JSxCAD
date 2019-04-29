import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height } = {}, shape) => {
  const geometry = shape.toZ0Surface();
  return Solid.fromPolygons(extrudeLinear({ height: height }, geometry.lazyGeometry.geometry.z0Surface));
};

const method = function (options) { return extrude(options, this); };

Z0Surface.prototype.extrude = method;
