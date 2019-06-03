import { differenceItems } from './differenceItems';
import { toTransformedGeometry } from './toTransformedGeometry';

// Traverse the assembly tree and disjoint it backward.
export const toDisjointGeometry = (untransformedGeometry) => {
  const geometry = toTransformedGeometry(untransformedGeometry);

  if (geometry.assembly === undefined) {
    // A singleton is disjoint.
    return geometry;
  } else if (geometry.disjointGeometry) {
    return geometry.disjointGeometry;
  } else {
    const subtractions = [];
    const walk = (geometry, disjointed) => {
      for (let nth = geometry.assembly.length - 1; nth >= 0; nth--) {
        const item = geometry.assembly[nth];
        if (item.assembly !== undefined) {
          disjointed.assembly.push(walk(item, { assembly: [], tags: item.tags }));
        } else {
          const differenced = differenceItems(item, ...subtractions);
          disjointed.assembly.push(differenced);
          subtractions.push(differenced);
        }
      }
      return disjointed;
    };
    const result = walk(geometry, { assembly: [], tags: geometry.tags });
    geometry.disjointGeometry = result;
    return result;
  }
};
