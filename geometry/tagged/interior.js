import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { interior as interiorOfOutlineGraph } from '@jsxcad/geometry-graph';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { toKeptGeometry } from './toKeptGeometry.js';

export const interior = (
  geometry,
  includeFaces = true,
  includeHoles = true
) => {
  const keptGeometry = toKeptGeometry(geometry);
  const interiors = [];
  for (const { tags, graph } of getNonVoidGraphs(keptGeometry)) {
    if (graph.isOutline) {
      interiors.push(taggedGraph({ tags }, interiorOfOutlineGraph(graph)));
    }
  }
  return taggedGroup({}, ...interiors);
};
