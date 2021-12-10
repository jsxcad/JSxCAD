import { disjoint, distributedDisjoint } from './disjoint.js';

export const assemble = (...geometries) => disjoint(geometries);

export const distributedAssemble = (...geometries) =>
  distributedDisjoint(geometries);
