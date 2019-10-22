import { flip as flipPath, rotateZ as rotateZPath, translate as translatePath } from '@jsxcad/geometry-path';
import { flip as flipSurface, makeConvex, retessellate, rotateZ as rotateZSurface, translate as translateSurface } from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

// FIX: Rewrite via buildFromFunction.
// FIX: This only works on z0surface.
const extrudeImpl = (z0Surface, height = 1, steps = 1, twistRadians = 0, cap = true) => {
  const surface = z0Surface;
  const polygons = [];
  const stepHeight = height / steps;

  // Build the walls.
  for (const polygon of surface) {
    const wall = flipPath(polygon.map(([x = 0, y = 0]) => [x, y, 0]));
    for (let step = 0; step < steps; step++) {
      const floor = translatePath([0, 0, stepHeight * (step + 0)], rotateZPath(twistRadians * (step + 0), wall));
      const roof = translatePath([0, 0, stepHeight * (step + 1)], rotateZPath(twistRadians * (step + 1), wall));
      // Walk around the floor to build the walls.
      for (let i = 0; i < floor.length; i++) {
        const floorStart = floor[i];
        const floorEnd = floor[(i + 1) % floor.length];
        const roofStart = roof[i];
        const roofEnd = roof[(i + 1) % roof.length];
        if (twistRadians === 0) {
          polygons.push([floorStart, roofStart, roofEnd, floorEnd]);
        } else {
          polygons.push([floorStart, roofStart, floorEnd]);
          polygons.push([roofStart, roofEnd, floorEnd]);
        }
      }
    }
  }

  if (cap) {
    const surface = retessellate(makeConvex({}, z0Surface));

    // Roof goes up.
    const roof = translateSurface([0, 0, height], rotateZSurface(twistRadians * steps, surface));

    // floor faces down.
    const floor = flipSurface(surface);

    polygons.push(...roof);
    polygons.push(...floor);
  }

  const solid = toSolidFromPolygons({}, polygons);
  return solid;
};

export const extrude = cache(extrudeImpl);
