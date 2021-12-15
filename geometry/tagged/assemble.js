import { disjoint, disjoint2, distributedDisjoint } from './disjoint.js';

export const assemble = (...geometries) => disjoint(geometries);

export const assemble2 = (...geometries) => disjoint2(geometries);

export const distributedAssemble = (...geometries) =>
  distributedDisjoint(geometries);
