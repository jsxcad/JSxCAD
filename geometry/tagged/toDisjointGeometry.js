import { difference } from './difference';
import { toTransformedGeometry } from './toTransformedGeometry';

const toDisjointAssembly = (geometry) => {
  if (geometry.assembly === undefined) {
    return geometry;
  } else if (geometry.disjoint !== undefined) {
    return geometry.disjoint;
  } else {
    const disjoint = [];
    for (let nth = geometry.assembly.length - 1; nth >= 0; nth--) {
      const item = toDisjointAssembly(geometry.assembly[nth]);
      disjoint.unshift(difference(item, ...disjoint));
    }
    const disjointAssembly = { disjointAssembly: disjoint, tags: geometry.tags };
    geometry.disjoint = disjointAssembly;
    return disjointAssembly;
  }
};

export const toDisjointGeometry = (inputGeometry) => toDisjointAssembly(toTransformedGeometry(inputGeometry));
