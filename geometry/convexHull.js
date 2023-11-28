import { Fuse } from './fuse.js';
import { Group } from './Group.js';
import { convexHull as convexHullWithCgal } from '@jsxcad/algorithm-cgal';
import { linearize } from './tagged/linearize.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(geometry.type);

export const ConvexHull = (geometries) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = convexHullWithCgal(inputs);
  return Group(outputs);
};

export const convexHull = (geometry, geometries) =>
  ConvexHull([geometry, ...geometries]);

export const ChainConvexHull = (geometries, { close = false } = {}) => {
  const chain = [];
  for (let nth = 1; nth < geometries.length; nth++) {
    chain.push(ConvexHull([geometries[nth - 1], geometries[nth]]));
  }
  if (close) {
    chain.push(ConvexHull([geometries[geometries.length - 1], geometries[0]]));
  }
  return Fuse(chain);
};

export const chainConvexHull = (geometry, geometries, { close = false } = {}) =>
  ChainConvexHull([geometry, ...geometries], { close });
