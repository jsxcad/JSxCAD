import { inLeaf, outLeaf } from './bsp.js';

import { splitPolygon } from './splitPolygon.js';

export const toConvexClouds = (bsp, normalize) => {
  const clouds = [];
  const walk = (bsp, polygons) => {
    if (bsp === outLeaf) {
      return null;
    } else if (bsp === inLeaf) {
      const cloud = [];
      for (const polygon of polygons) {
        cloud.push(...polygon.map(normalize));
      }
      clouds.push(cloud);
    } else {
      const back = [...bsp.same];
      const front = [...bsp.same];
      for (const polygon of polygons) {
        splitPolygon(normalize, bsp.plane, polygon, back, front, back, front);
      }
      walk(bsp.front, front);
      walk(bsp.back, back);
    }
  };
  walk(bsp, []);
  return clouds;
};

export default toConvexClouds;
