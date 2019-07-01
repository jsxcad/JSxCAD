import { add } from '@jsxcad/math-vec3';
import { fromPolygons } from './fromPolygons';
import { flip, translate } from '@jsxcad/geometry-surface';

export const extrude = ({ height = 1 }, surface) => {
  const polygons = [];
  const up = [0, 0, height];

  // Build the walls.
  for (const polygon of surface) {
    // Build floor outline. This need not be a convex polygon.
    const floor = polygon.map(point => [point[0], point[1], 0]).reverse();
    // Walk around the floor to build the walls.
    for (let i = 0; i < floor.length; i++) {
      const start = floor[i];
      const end = floor[(i + 1) % floor.length];
      // Remember that we are walking CCW.
      // polygons.push([start, add(start, up), end]);
      // polygons.push([end, add(start, up), add(end, up)]);
      polygons.push([start, add(start, up), add(end, up), end]);
    }
  }

  // Walls go around.
  const walls = fromPolygons({}, polygons);

  // Roof goes up.
  const roof = translate([0, 0, height], surface);

  // floor faces down.
  const floor = flip(surface);

  // And form a solid.
  const solid = [roof, floor, ...walls];

  if (surface.isConvex) {
    solid.isConvex = true;
  }

  return solid;
};
