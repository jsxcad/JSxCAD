import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { outline as outlineGraph } from '../graph/outline.js';
import { taggedPaths } from './taggedPaths.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';

// FIX: The semantics here are a bit off.
// Let's consider the case of Assembly(Square(10), Square(10).outline()).outline().
// This will drop the Square(10).outline() as it will not be outline-able.
// Currently we need this so that things like withOutline() will work properly,
// but ideally outline would be idempotent and rewrite shapes as their outlines,
// unless already outlined, and handle the withOutline case within this.
export const outline = (geometry, tagsOverride) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  const outlines = [];
  for (let graphGeometry of getNonVoidGraphs(disjointGeometry)) {
    let tags = graphGeometry.tags;
    if (tagsOverride) {
      tags = tagsOverride;
    }
    outlines.push(outlineGraph({ tags }, graphGeometry));
  }
  // Turn paths into wires.
  for (let { tags = [], paths } of getNonVoidPaths(disjointGeometry)) {
    if (tagsOverride) {
      tags = tagsOverride;
    }
    outlines.push(taggedPaths({ tags: [...tags, 'path/Wire'] }, paths));
  }
  return outlines;
};
