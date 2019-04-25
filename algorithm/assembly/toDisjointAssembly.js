import { differenceItems } from './differenceItems';

// Traverse the assembly tree and disjoint it backward.
export const toDisjointAssembly = (geometry) => {
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
  return walk(geometry, { assembly: [], tags: geometry.tags });
};
