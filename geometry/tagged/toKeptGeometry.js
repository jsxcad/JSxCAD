import { assertGood } from './assertGood';
import { toDisjointGeometry } from './toDisjointGeometry';

// Produce a disjoint geometry suitable for display.

export const toKeptGeometry = (geometry) => {
  assertGood(geometry);
  if (geometry.keptGeometry === undefined) {
    const disjointGeometry = toDisjointGeometry(geometry);
    const walk = (geometry) => {
      assertGood(geometry);
      if (geometry.keptGeometry !== undefined) {
        return geometry.keptGeometry;
      } else if (geometry.tags === undefined || !geometry.tags.includes('@drop')) {
        if (geometry.disjointAssembly) {
          const keptGeometry = { ...geometry, disjointAssembly: geometry.disjointAssembly.map(walk).filter(item => item !== undefined) };
          geometry.keptGeometry = keptGeometry;
          return keptGeometry;
        } else {
          return geometry;
        }
      }
    };
    const keptGeometry = walk(disjointGeometry);
    assertGood(keptGeometry);
    geometry.keptGeometry = keptGeometry || {};
  }
  return geometry.keptGeometry;
};
