import { transform } from '@jsxcad/algorithm-polygons';
import { toPlane } from '@jsxcad/math-poly3';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { union } from '@jsxcad/algorithm-z0polygons';

export const toSolidWithSimpleSurfaces = ({ emitSurface }, solid) => {
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

  const simplified = [];

  for (const group of coplanarGroups.values()) {
    const [to, from] = toXYPlaneTransforms(toPlane(group[0]));
    let surface = union(...transform(to, group).map(polygon => [polygon]));
    if (emitSurface) {
      emitSurface(surface);
    }
    simplified.push(...transform(from, surface));
  }

  return simplified;
};
