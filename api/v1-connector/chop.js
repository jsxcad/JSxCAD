import { Shape, assemble } from "@jsxcad/api-v1-shape";
import { getAnySurfaces, getPlans, getSolids } from "@jsxcad/geometry-tagged";

import Z from "./Z";
import { cut as bspCut } from "@jsxcad/algorithm-bsp-surfaces";
import { cut as surfaceCut } from "@jsxcad/geometry-surface";
import { toXYPlaneTransforms } from "@jsxcad/math-plane";
import { transform } from "@jsxcad/geometry-path";

/**
 *
 * # Chop
 *
 * Remove the parts of a shape above surface, defaulting to Z(0).
 *
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).chop(Z(0)));
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, -60, 60], "target": [0, 0, 0] } }
 * ```
 * Cube(10).with(Cube(10).moveX(10).chop(Z(0).flip()));
 * ```
 * :::
 *
 **/

const toPlane = (connector) => {
  for (const entry of getPlans(connector.toKeptGeometry())) {
    if (entry.plan && entry.plan.connector) {
      return entry.planes[0];
    }
  }
};

const toSurface = (plane) => {
  const max = +1e5;
  const min = -1e5;
  const [, from] = toXYPlaneTransforms(plane);
  const path = [
    [max, max, 0],
    [min, max, 0],
    [min, min, 0],
    [max, min, 0],
  ];
  const polygon = transform(from, path);
  return [polygon];
};

export const chop = (shape, connector = Z()) => {
  const cuts = [];
  const planeSurface = toSurface(toPlane(connector));
  for (const { solid, tags } of getSolids(shape.toKeptGeometry())) {
    const cutResult = bspCut(solid, planeSurface);
    cuts.push(Shape.fromGeometry({ solid: cutResult, tags }));
  }
  for (const { surface, z0Surface, tags } of getAnySurfaces(
    shape.toKeptGeometry()
  )) {
    const cutSurface = surface || z0Surface;
    const cutResult = surfaceCut(planeSurface, cutSurface);
    cuts.push(Shape.fromGeometry({ surface: cutResult, tags }));
  }

  return assemble(...cuts);
};

const chopMethod = function (surface) {
  return chop(this, surface);
};
Shape.prototype.chop = chopMethod;

chop.signature = "chop(shape:Shape, surface:Shape) -> Shape";
chopMethod.signature = "Shape -> chop(surface:Shape) -> Shape";

export default chop;
