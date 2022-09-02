import { disjoint } from '../disjoint.js';

export const assemble = (geometries, exact) =>
  disjoint(geometries, undefined, exact);
