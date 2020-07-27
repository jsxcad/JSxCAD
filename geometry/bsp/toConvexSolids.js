import { buildConvexHull } from '@jsxcad/algorithm-shape';
import toConvexClouds from './toConvexClouds.js';

export const toConvexSolids = (bsp, normalize) => {
  const solids = [];
  for (const cloud of toConvexClouds(bsp, normalize)) {
    solids.push(buildConvexHull(cloud));
  }
  return solids;
};

export default toConvexSolids;
