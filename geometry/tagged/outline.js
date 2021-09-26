import { getEdges } from '../path/getEdges.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { hasTypeWire } from './type.js';
import { outline as outlineGraph } from '../graph/outline.js';
import { taggedSegments } from './taggedSegments.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';

// FIX: The semantics here are a bit off.
// Let's consider the case of Assembly(Square(10), Square(10).outline()).outline().
// This will drop the Square(10).outline() as it will not be outline-able.
// Currently we need this so that things like withOutline() will work properly,
// but ideally outline would be idempotent and rewrite shapes as their outlines,
// unless already outlined, and handle the withOutline case within this.
export const outline = (geometry, tagsOverride) => {
  const concreteGeometry = toConcreteGeometry(geometry);
  const outlines = [];
  for (let graphGeometry of getNonVoidGraphs(concreteGeometry)) {
    let tags = graphGeometry.tags;
    if (tagsOverride) {
      tags = tagsOverride;
    }
    outlines.push(hasTypeWire(outlineGraph({ tags }, graphGeometry)));
  }
  // Turn paths into wires.
  for (let { tags = [], paths } of getNonVoidPaths(concreteGeometry)) {
    if (tagsOverride) {
      tags = tagsOverride;
    }
    const segments = [];
    for (const path of paths) {
      for (const edge of getEdges(path)) {
        segments.push(edge);
      }
    }
    outlines.push(hasTypeWire(taggedSegments({ tags }, segments)));
  }
  return outlines;
};
