import {
  flip as flipPath,
  translate as translatePath,
} from '@jsxcad/geometry-path';

import {
  flip as flipSurface,
  makeConvex,
  outline,
  translate as translateSurface,
} from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';

import { createNormalize2 } from '@jsxcad/algorithm-quantize';

import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

/** @type {function(surface:Surface, height:number, depth:number, cap:boolean):Solid} */
const extrudeImpl = (surface, height = 1, depth = 0, cap = true) => {
  const normalize = createNormalize2();
  const surfaceOutline = outline(surface, normalize);
  /** @type {Polygon[]} */
  const polygons = [];
  const stepHeight = height - depth;

  // Build the walls.
  for (const polygon of surfaceOutline) {
    const wall = flipPath(polygon);
    const floor = translatePath([0, 0, depth + stepHeight * 0], wall);
    const roof = translatePath([0, 0, depth + stepHeight * 1], wall);
    // Walk around the floor to build the walls.
    for (let i = 0; i < floor.length; i++) {
      const floorStart = floor[i];
      const floorEnd = floor[(i + 1) % floor.length];
      const roofStart = roof[i];
      const roofEnd = roof[(i + 1) % roof.length];
      polygons.push([floorStart, roofStart, roofEnd, floorEnd]);
    }
  }

  if (cap) {
    // FIX: This is already Z0.
    // FIX: This is bringing the vertices out of alignment?
    const surface = makeConvex(surfaceOutline, normalize);

    // Roof goes up.
    const roof = translateSurface([0, 0, height], surface);
    polygons.push(...roof);

    // floor faces down.
    const floor = translateSurface([0, 0, depth], flipSurface(surface));
    polygons.push(...floor);
  }

  const solid = fromPolygonsToSolid(polygons);
  return solid;
};

/**
 * Extrudes a surface vertically.
 * @type {function(Surface, height:number, depth:number, cap:boolean):Solid}
 */
export const extrude = cache(extrudeImpl);
