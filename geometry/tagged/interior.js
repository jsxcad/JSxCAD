import {
  close as closePath,
  isClosed as isClosedPath,
} from '@jsxcad/geometry-path';
import {
  fromPolygons as fromPolygonsToGraph,
  interior as interiorOfOutlineGraph,
} from '@jsxcad/geometry-graph';

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
    for (let path of paths) {
      if (!isClosedPath(path)) {
        path = closePath(path);
      }
      // FIX: Check path is planar.
      // FIX: This should consider arrangements with holes.
      interiors.push(taggedGraph({ tags }, fromPolygonsToGraph([path])));
    }
  }
  return taggedGroup({}, ...interiors);
};
