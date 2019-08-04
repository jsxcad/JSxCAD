import { assertGood } from './assertGood';
import { difference } from './difference';
import { toTransformedGeometry } from './toTransformedGeometry';

const toDisjointAssembly = (geometry) => {
  assertGood(geometry);
  if (geometry.assembly === undefined) {
    return geometry;
  } else if (geometry.disjoint !== undefined) {
    return geometry.disjoint;
  } else {
    const disjoint = [];
    for (let nth = geometry.assembly.length - 1; nth >= 0; nth--) {
      assertGood(geometry.assembly[nth]);
      const item = toDisjointAssembly(geometry.assembly[nth]);
      assertGood(item);
      disjoint.unshift(difference(item, ...disjoint));
    }
    const disjointAssembly = { disjointAssembly: disjoint };
    geometry.disjoint = disjointAssembly;
    assertGood(disjointAssembly);
    return disjointAssembly;
  }
};

export const toDisjointGeometry = (inputGeometry) => toDisjointAssembly(toTransformedGeometry(inputGeometry));
