import { toConcreteGeometry } from './toConcreteGeometry.js';

export const DISJUNCTION_TOTAL = 'complete';
export const DISJUNCTION_VISIBLE = 'visible';

// FIX: Remove toDisjointGeometry and replace with a more meaningful operation.
export const toDisjointGeometry = (geometry) => toConcreteGeometry(geometry);

export const toVisiblyDisjointGeometry = (geometry) =>
  toDisjointGeometry(geometry, DISJUNCTION_VISIBLE);
