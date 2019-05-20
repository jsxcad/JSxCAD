import { add } from '@jsxcad/math-vec3';
import { makeConvex } from '@jsxcad/geometry-z0surface';
import { fromPolygons } from '@jsxcad/geometry-solid';

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
      polygons.push([start, add(start, up), end]);
      polygons.push([end, add(start, up), add(end, up)]);
    }
  }

  // Build the roof and floor from convex polygons.
  for (const polygon of makeConvex({}, surface)) {
    const floor = polygon.map(point => [point[0], point[1], 0]).reverse();
    const roof = floor.map(vertex => add(vertex, up)).reverse();
    polygons.push(roof, floor);
  }

  return fromPolygons({}, polygons);
};
