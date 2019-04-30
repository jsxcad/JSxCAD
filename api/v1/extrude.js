import { Shape } from './Shape';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const extrude = ({ height } = {}, shape) => {
  const geometry = shape.toZ0Surface();
  const extrusion = extrudeLinear({ height: height }, geometry.lazyGeometry.geometry.z0Surface);
  const extrudedShape = Shape.fromPolygonsToSolid(extrusion);
  return extrudedShape;
};

const method = function (options) { return extrude(options, this); };

Shape.prototype.extrude = method;
