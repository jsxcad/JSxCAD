import {
  flip as flipPath,
  translate as translatePath
} from '@jsxcad/geometry-path';

import {
  flip as flipSurface,
  makeConvex,
  translate as translateSurface
} from '@jsxcad/geometry-surface';

import {
  cache
} from '@jsxcad/cache';

import {
  outline
} from '@jsxcad/geometry-z0surface-boolean';

import {
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

// FIX: Rewrite via buildFromFunction.
// FIX: This only works on z0surface.
const extrudeImpl = (z0Surface, height = 1, depth = 0, cap = true) => {
  const surface = z0Surface;
  const polygons = [];
  const stepHeight = height - depth;

  // Build the walls.
  for (const polygon of outline(surface)) {
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
    const surface = makeConvex(z0Surface);

    // Roof goes up.
    const roof = translateSurface([0, 0, height], surface);
    polygons.push(...roof);

    // floor faces down.
    const floor = translateSurface([0, 0, depth], flipSurface(surface));
    polygons.push(...floor);
  }

  const solid = toSolidFromPolygons({}, polygons);
  return solid;
};

export const extrude = cache(extrudeImpl);
