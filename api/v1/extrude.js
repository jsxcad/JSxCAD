import { Shape } from './Shape';
import { assertNumber } from './assert';
import { dispatch } from './dispatch';
import { extrudeLinear } from '@jsxcad/algorithm-shape';

export const fromHeight = ({ height }, shape) => {
  const geometry = shape.toZ0Surface();
  const extrusion = extrudeLinear({ height: height }, geometry.lazyGeometry.geometry.z0Surface);
  const extrudedShape = Shape.fromPolygonsToSolid(extrusion).translate([0, 0, height / 2]);
  return extrudedShape;
};

export const extrude = dispatch(
  'extrude',
  ({ height }, shape) => {
    assertNumber(height);
    return () => fromHeight({ height }, shape);
  }
);

const method = function (options) { return extrude(options, this); };

Shape.prototype.extrude = method;
