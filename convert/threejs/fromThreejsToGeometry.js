import { Group, Mesh } from '@jsxcad/algorithm-threejs';

import { fromTrianglesToGraph, taggedGroup } from '@jsxcad/geometry';
import { toTagFromRgb } from '@jsxcad/algorithm-color';

export const fromThreejsToGeometry = async (threejs) => {
  if (threejs instanceof Group) {
    const children = [];
    for (const child of threejs.children) {
      const childGeometry = await fromThreejsToGeometry(child);
      if (childGeometry) {
        children.push(childGeometry);
      }
    }
    return taggedGroup({}, ...children);
  } else if (threejs instanceof Mesh) {
    const { geometry, material } = threejs;
    const color = material.color;
    const tags = [toTagFromRgb(color.r, color.g, color.b)];
    const triangles = [];
    if (geometry.index) {
      const p = geometry.attributes.position.array;
      const x = geometry.index.array;
      const pt = (i) => {
        const v = x[i] * 3;
        return [p[v], p[v + 1], p[v + 2]];
      };
      for (let i = 0; i < x.length; i += 3) {
        const points = [pt(i), pt(i + 1), pt(i + 2)];
        triangles.push({ points });
      }
    } else {
      const p = geometry.attributes.position.array;
      for (let i = 0; i < p.length; i += 9) {
        const points = [
          [p[i + 0], p[i + 1], p[i + 2]],
          [p[i + 3], p[i + 4], p[i + 5]],
          [p[i + 6], p[i + 7], p[i + 8]],
        ];
        triangles.push({ points });
      }
    }
    return fromTrianglesToGraph({ tags }, triangles);
  }
};
