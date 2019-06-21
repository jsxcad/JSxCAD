import { differenceItems } from './differenceItems';
import { toTransformedGeometry } from './toTransformedGeometry';

// Traverse the assembly tree and disjoint it backward.
export const toDisjointGeometry = (untransformedGeometry) => {
  const geometry = toTransformedGeometry(untransformedGeometry);

  if (geometry.disjointGeometry === undefined) {
    if (geometry.assembly === undefined) {
      // A singleton is disjoint.
      geometry.disjointGeometry = geometry;
    } else {
      const subtractions = [];
      const walk = (geometry, disjointed) => {
        for (let nth = geometry.assembly.length - 1; nth >= 0; nth--) {
          const item = geometry.assembly[nth];
          if (item.assembly !== undefined) {
            disjointed.assembly.push(walk(item, { assembly: [], tags: item.tags }));
          } else {
            if (item.tags === undefined || !item.tags.includes('@drop')) {
              // Undropped items need to be trimmed.
              const differenced = differenceItems(item, ...subtractions);
              disjointed.assembly.push(differenced);
              subtractions.push(differenced);
            } else {
              // Dropped items do not need to be trimmed.
              disjointed.assembly.push(item);
              subtractions.push(item);
            }
          }
        }
        return disjointed;
      };
      const result = walk(geometry, { assembly: [], tags: geometry.tags });
      geometry.disjointGeometry = result;
    }
  }
  return geometry.disjointGeometry;
};
