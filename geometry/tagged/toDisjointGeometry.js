import { toConcreteGeometry } from './toConcreteGeometry.js';

export const DISJUNCTION_TOTAL = 'complete';
export const DISJUNCTION_VISIBLE = 'visible';

/*
import { visit } from './visit.js';

const linkDisjointAssembly = Symbol('linkDisjointAssembly');

export const clearDisjointGeometry = (geometry) => {
  delete geometry[linkDisjointAssembly];
  return geometry;
};

const hasVoidGeometry = (geometry) => {
  if (isVoid(geometry)) {
    return true;
  }
  if (geometry.content) {
    for (const content of geometry.content) {
      if (hasVoidGeometry(content)) {
        return true;
      }
    }
  }
};

export const toDisjointGeometry = (geometry, mode = DISJUNCTION_TOTAL) => {
  const op = (geometry, descend, walk, state) => {
    if (geometry[linkDisjointAssembly]) {
      return geometry[linkDisjointAssembly];
    } else if (geometry.type === 'disjointAssembly') {
      // Everything below this point is disjoint.
      return geometry;
    } else if (geometry.type === 'displayGeometry') {
      // We pretend that everything below this point is disjoint.
      return geometry;
    } else if (geometry.type === 'plan') {
      return walk(reify(geometry).content[0], op);
    } else if (geometry.type === 'transform') {
      return walk(toTransformedGeometry(geometry), op);
    } else if (geometry.type === 'assembly') {
      if (mode === DISJUNCTION_VISIBLE && !hasVoidGeometry(geometry)) {
        // This leads to some potential invariant violations.
        // With toVisiblyDisjoint geometry we may get assembly within
        // disjointAssembly.
        // This is acceptable for displayGeometry, but otherwise problematic.
        // For this reason we wrap the output as DisplayGeometry.
        // FIX: This is leaking backward via parent linkDisjointAssembly.
        return taggedDisplayGeometry(
          {},
          toTransformedGeometry(reify(geometry))
        );
      }
      const assembly = geometry.content.map((entry) => rewrite(entry, op));
      const disjointAssembly = [];
      for (let i = assembly.length - 1; i >= 0; i--) {
        disjointAssembly.unshift(difference(assembly[i], ...disjointAssembly));
      }
      const disjointed = taggedDisjointAssembly({}, ...disjointAssembly);
      geometry[linkDisjointAssembly] = disjointed;
      return disjointed;
    } else {
      return descend();
    }
  };
  // FIX: Interleave toTransformedGeometry into this rewrite.
  if (geometry.type === 'disjointAssembly') {
    return geometry;
  } else {
    const disjointed = rewrite(geometry, op);
    if (disjointed.type === 'disjointAssembly') {
      geometry[linkDisjointAssembly] = disjointed;
      return disjointed;
    } else {
      const wrapper = taggedDisjointAssembly({}, disjointed);
      geometry[linkDisjointAssembly] = wrapper;
      return wrapper;
    }
  }
};
*/

// FIX: Remove toDisjointGeometry and replace with a more meaningful operation.
export const toDisjointGeometry = (geometry) => toConcreteGeometry(geometry);

export const toVisiblyDisjointGeometry = (geometry) =>
  toDisjointGeometry(geometry, DISJUNCTION_VISIBLE);
