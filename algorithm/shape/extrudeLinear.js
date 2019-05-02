import { add } from '@jsxcad/math-vec3';
import { makeConvex } from '@jsxcad/geometry-polygons';

export const extrudeLinear = ({ height = 1 }, polygons) => {
  const extruded = [];
  const up = [0, 0, height];

  // Build the walls.
  for (const polygon of polygons) {
    // Build floor outline. This need not be a convex polygon.
    const floor = polygon.map(point => [point[0], point[1], height / -2]).reverse();
    // Walk around the floor to build the walls.
    for (let i = 0; i < floor.length; i++) {
      const start = floor[i];
      const end = floor[(i + 1) % floor.length];
      // Remember that we are walking CCW.
      extruded.push([start, add(start, up), end]);
      extruded.push([end, add(start, up), add(end, up)]);
    }
  }

  // Build the roof and floor from convex polygons.
  for (const polygon of makeConvex({}, polygons)) {
    const floor = polygon.map(point => [point[0], point[1], height / -2]).reverse();
    const roof = floor.map(vertex => add(vertex, up)).reverse();
    extruded.push(roof, floor);
  }

  return extruded;
};
