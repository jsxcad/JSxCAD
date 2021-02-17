import { outlineSolid, outlineSurface } from '@jsxcad/geometry-halfedge';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { getNonVoidSolids } from './getNonVoidSolids.js';
import { getNonVoidSurfaces } from './getNonVoidSurfaces.js';
import { taggedPaths } from './taggedPaths.js';
import { toKeptGeometry } from './toKeptGeometry.js';
import { toPaths as toPathsFromGraph } from '@jsxcad/geometry-graph';

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
  for (const { tags, solid } of getNonVoidSolids(keptGeometry)) {
    outlines.push(taggedPaths({ tags }, outlineSolid(solid, normalize)));
  }
  for (const { tags, graph } of getNonVoidGraphs(keptGeometry)) {
    outlines.push(taggedPaths({ tags }, toPathsFromGraph(graph)));
  }
  // Turn paths into wires.
  for (const { tags = [], paths } of getNonVoidPaths(keptGeometry)) {
    outlines.push(taggedPaths({ tags: [...tags, 'path/Wire'] }, paths));
  }
  // This is a bit tricky -- let's consider an assembly that produces an effective surface.
  // For now, let's consolidate, and see what goes terribly wrong.
  for (const { tags, surface } of getNonVoidSurfaces(keptGeometry)) {
    outlines.push(
      taggedPaths(
        { tags },
        outlineSurface(surface, normalize, includeFaces, includeHoles)
      )
    );
  }
  return outlines;
};

export const outline = cache(outlineImpl);
