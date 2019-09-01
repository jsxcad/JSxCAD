import { flip as flipPath, rotateZ as rotateZPath, translate as translatePath } from '@jsxcad/geometry-path';
import { flip as flipSurface, makeConvex, retessellate, rotateZ as rotateZSurface, translate as translateSurface } from '@jsxcad/geometry-surface';
import { fromPolygons as toSolidFromPolygons } from '@jsxcad/geometry-solid';

// FIX: Consider a general transformation, rather than just twist.
export const extrude = ({ height = 1, steps = 1, twistRadians = 0 }, rawSurface) => {
  const surface = retessellate(makeConvex({}, rawSurface));
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

  // Roof goes up.
  const roof = translateSurface([0, 0, height], rotateZSurface(twistRadians * steps, surface));

  // floor faces down.
  const floor = flipSurface(surface);

  polygons.push(...roof);
  polygons.push(...floor);

  return toSolidFromPolygons({}, polygons);
};
