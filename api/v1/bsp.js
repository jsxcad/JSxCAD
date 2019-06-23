import { Shape } from './Shape';
import { fromSurfaces } from '@jsxcad/algorithm-bsp-surfaces';
import { getSolids } from '@jsxcad/geometry-tagged';

/**
 *
 * # BSP
 *
 * Generates a BSP tree of the solid.
 *
 **/

export const bsp = (shape) => {
  const bsps = [];
  for (const { solid } of getSolids(shape.toKeptGeometry())) {
    bsps.push(fromSurfaces({}, solid));
  }
  return bsps;
};

const method = function () { return bsp(this); };

Shape.prototype.bsp = method;
