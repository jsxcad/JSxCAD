import { outlineSolid, outlineSurface } from '@jsxcad/geometry-halfedge';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidSolids } from './getNonVoidSolids.js';
import { outline as outlineGraph } from '@jsxcad/geometry-graph';
import { taggedGraph } from './taggedGraph.js';
import { taggedPaths } from './taggedPaths.js';
import { toKeptGeometry } from './toKeptGeometry.js';

// FIX: The semantics here are a bit off.
// Let's consider the case of Assembly(Square(10), Square(10).outline()).outline().
// This will drop the Square(10).outline() as it will not be outline-able.
// Currently we need this so that things like withOutline() will work properly,
// but ideally outline would be idempotent and rewrite shapes as their outlines,
// unless already outlined, and handle the withOutline case within this.
const outlineImpl = (geometry, includeFaces = true, includeHoles = true) => {
  const normalize = createNormalize3();

  const keptGeometry = toKeptGeometry(geometry);
  const outlines = [];
  for (const { solid } of getNonVoidSolids(keptGeometry)) {
    outlines.push(taggedPaths({}, outlineSolid(solid, normalize)));
  }
  for (const { graph } of getNonVoidGraphs(keptGeometry)) {
    outlines.push(taggedGraph({}, outlineGraph(graph)));
  }
  // This is a bit tricky -- let's consider an assembly that produces an effective surface.
  // For now, let's consolidate, and see what goes terribly wrong.
  for (const surface of getAnyNonVoidSurfaces(keptGeometry).map(
    ({ surface, z0Surface }) => surface || z0Surface
  )) {
    outlines.push(
      taggedPaths(
        {},
        outlineSurface(surface, normalize, includeFaces, includeHoles)
      )
    );
  }
  return outlines;
};

export const outline = cache(outlineImpl);
