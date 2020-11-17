import {
  fromPaths as fromPathsToGraph,
  interior as interiorOfOutlineGraph,
} from '@jsxcad/geometry-graph';

import { close as closePaths } from '@jsxcad/geometry-paths';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
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
  for (const { tags, paths } of getNonVoidPaths(keptGeometry)) {
    interiors.push(
      taggedGraph(
        { tags },
        interiorOfOutlineGraph(fromPathsToGraph(closePaths(paths)))
      )
    );
  }
  return taggedGroup({}, ...interiors);
};
