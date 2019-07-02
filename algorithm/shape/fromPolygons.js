import { toPlane } from '@jsxcad/math-poly3';

export const fromPolygons = (options = {}, polygons) => {
  const coplanarGroups = new Map();

  for (const polygon of polygons) {
    const plane = toPlane(polygon);
    if (isNaN(plane[0])) {
      throw Error('die');
    }
    const key = JSON.stringify(plane);
    const groups = coplanarGroups.get(key);
    if (groups === undefined) {
      coplanarGroups.set(key, [polygon]);
    } else {
      groups.push(polygon);
    }
  }

  // The solid is a list of surfaces, which are lists of coplanar polygons.
  const solid = [...coplanarGroups.values()];

  return solid;
};
