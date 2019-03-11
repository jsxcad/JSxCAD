import { add } from '@jsxcad/math-vec3';

export const extrudeLinear = ({ height = 1 }, polygons) => {
  const extruded = [];
  const up = [0, 0, height];
  for (const polygon of polygons) {
    // Build floor.
    const floor = polygon.map(point => [point[0], point[1], height / -2]).reverse();
    extruded.push(floor);
    // Walk around the floor to build the walls.
    for (let i = 0; i < floor.length; i++) {
      const start = floor[i];
      const end = floor[(i + 1) % floor.length];
      // Remember that we are walking CCW.
      extruded.push([start, add(start, up), add(end, up), end]);
    }
    // Walk around the floor and reverse to build the roof.
    extruded.push(floor.map(vertex => add(vertex, up)).reverse());
  }
  return extruded;
};
