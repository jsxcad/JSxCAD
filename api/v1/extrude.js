import { Shape } from './Shape';
import { assemble } from './assemble';
import { assertNumber } from './assert';
import { dispatch } from './dispatch';
import { extrudeLinear } from '@jsxcad/algorithm-shape';
import { getZ0Surfaces } from '@jsxcad/geometry-eager';

export const fromHeight = ({ height }, shape) => {
  const z0Surfaces = getZ0Surfaces(shape.toGeometry());
  const extrusions = z0Surfaces.map(z0Surface => extrudeLinear({ height: height }, z0Surface));
  const extrudedShapes = extrusions.map(extrusion => Shape.fromPolygonsToSolid(extrusion).translate([0, 0, height / 2]));
  return assemble(...extrudedShapes);
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
