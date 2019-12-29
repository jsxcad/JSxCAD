import { flip as flipPath, rotateZ as rotateZPath, translate as translatePath } from '@jsxcad/geometry-path';
import { flip as flipSurface, makeConvex, rotateZ as rotateZSurface, translate as translateSurface } from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';
import { createNormalize2 } from '@jsxcad/algorithm-quantize';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

// FIX: Rewrite via buildFromFunction.
// FIX: This only works on z0surface.
const extrudeImpl = (z0Surface, height = 1, depth = 0, steps = 1, twistRadians = 0, cap = true) => {
  const normalize = createNormalize2();
  const surface = z0Surface;
  const polygons = [];
  const stepHeight = (height - depth) / steps;
  const twistPerStep = twistRadians * (height - depth) / steps;

  // Build the walls.
  for (const polygon of surface) {
    const wall = flipPath(polygon.map(normalize));
    for (let step = 0; step < steps; step++) {
      const floor = translatePath([0, 0, depth + stepHeight * (step + 0)],
                                  rotateZPath(twistPerStep * (step + 0), wall));
      const roof = translatePath([0, 0, depth + stepHeight * (step + 1)],
                                 rotateZPath(twistPerStep * (step + 1), wall));
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
    // FIX: This is already Z0.
    // FIX: This is bringing the vertices out of alignment?
    const surface = makeConvex(z0Surface, normalize);

    // Roof goes up.
    const roof = translateSurface([0, 0, height], rotateZSurface(twistPerStep * steps, surface));

    // floor faces down.
    const floor = translateSurface([0, 0, depth], flipSurface(surface));

    polygons.push(...roof);
    polygons.push(...floor);
  }

  const solid = toSolidFromPolygons({}, polygons);
  return solid;
};

export const extrude = cache(extrudeImpl);
