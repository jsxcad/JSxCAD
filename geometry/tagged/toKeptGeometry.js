import { toDisjointGeometry } from './toDisjointGeometry';

// Produce a disjoint geometry suitable for display.

export const toKeptGeometry = (geometry) => {
  if (geometry.keptGeometry === undefined) {
    const disjointGeometry = toDisjointGeometry(geometry);
    const walk = (geometry) => {
      if (geometry.keptGeometry !== undefined) {
        return geometry.keptGeometry;
      } else if (geometry.tags === undefined || !geometry.tags.includes('compose/non-positive')) {
        if (geometry.disjointAssembly) {
          const kept = geometry.disjointAssembly.map(walk).filter(item => item !== undefined);
          if (kept.length > 0) {
            const keptGeometry = { ...geometry, disjointAssembly: geometry.disjointAssembly.map(walk).filter(item => item !== undefined) };
            geometry.keptGeometry = keptGeometry;
            return keptGeometry;
          } else {
            return undefined;
          }
        } else {
          return geometry;
        }
      }
    };
    const keptGeometry = walk(disjointGeometry);
    geometry.keptGeometry = keptGeometry || { disjointAssembly: [] };
  }
  return geometry.keptGeometry;
};
