import { difference } from './difference';

// Traverse the assembly tree and disjoint it backward.
export const toDisjointAssembly = (geometry) => {
  const subtractions = [];
  const walk = (geometry, disjointed) => {
console.log(`QQ/walk/geometry: ${JSON.stringify(geometry)}`);
    for (const item of geometry.assembly) {
      if (item.assembly !== undefined) {
        disjointed.assembly.push(walk(item, { assembly: [], tags: item.tags }));
      } else {
        const differenced = difference(item, ...subtractions);
        disjointed.assembly.push(differenced);
        subtractions.push(differenced);
      }
    }
    return disjointed;
  };
  return walk(geometry, { assembly: [], tags: geometry.tags });
};
