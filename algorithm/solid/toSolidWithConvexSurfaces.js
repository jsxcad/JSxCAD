import { makeConvex, transform } from '@jsxcad/algorithm-polygons';
import { toPlane } from '@jsxcad/math-poly3';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { union } from '@jsxcad/algorithm-z0polygons';

// NOTE: Currently triangulates.
export const toSolidWithConvexSurfaces = ({ emitSurface }, solid) => {
  const coplanarGroups = new Map();

  for (const polygon of solid) {
    const plane = toPlane(polygon);
    const key = JSON.stringify(plane);
    const groups = coplanarGroups.get(key);
    if (groups === undefined) {
      coplanarGroups.set(key, [polygon]);
    } else {
      groups.push(polygon);
    }
  }

  const retessellated = [];

  for (const group of coplanarGroups.values()) {
    const [to, from] = toXYPlaneTransforms(toPlane(group[0]));
    let surface = makeConvex({}, union(...transform(to, group).map(polygon => [polygon])));
    if (emitSurface) {
      emitSurface(surface);
    }
    retessellated.push(...transform(from, surface));
  }

  return retessellated;
};
