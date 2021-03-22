import { cache } from '@jsxcad/cache';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { taggedPaths } from './taggedPaths.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';
import { toPaths as toPathsFromGraph } from '@jsxcad/geometry-graph';

// FIX: The semantics here are a bit off.
// Let's consider the case of Assembly(Square(10), Square(10).outline()).outline().
// This will drop the Square(10).outline() as it will not be outline-able.
// Currently we need this so that things like withOutline() will work properly,
// but ideally outline would be idempotent and rewrite shapes as their outlines,
// unless already outlined, and handle the withOutline case within this.
const outlineImpl = (geometry, includeFaces = true, includeHoles = true) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  const outlines = [];
  for (const { tags = [], graph } of getNonVoidGraphs(disjointGeometry)) {
    outlines.push(
      taggedPaths({ tags: [...tags, 'path/Wire'] }, toPathsFromGraph(graph))
    );
  }
  // Turn paths into wires.
  for (const { tags = [], paths } of getNonVoidPaths(disjointGeometry)) {
    outlines.push(taggedPaths({ tags: [...tags, 'path/Wire'] }, paths));
  }
  return outlines;
};

export const outline = cache(outlineImpl);
