import { disjoint } from '../disjoint.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

export const toDisjointGeometry = (geometry) =>
  disjoint([toConcreteGeometry(geometry)]);

export const toVisiblyDisjointGeometry = (geometry) =>
  toDisjointGeometry(geometry);
