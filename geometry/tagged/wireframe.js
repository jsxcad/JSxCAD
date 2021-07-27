import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { taggedPaths } from './taggedPaths.js';
import { toDisjointGeometry } from './toDisjointGeometry.js';
import { wireframe as wireframeGraph } from '../graph/wireframe.js';

export const wireframe = (geometry, tagsOverride) => {
  const disjointGeometry = toDisjointGeometry(geometry);
  const wireframes = [];
  for (let graphGeometry of getNonVoidGraphs(disjointGeometry)) {
    let tags = graphGeometry.tags;
    if (tagsOverride) {
      tags = tagsOverride;
    }
    wireframes.push(wireframeGraph({ tags }, graphGeometry));
  }
  // Turn paths into wires.
  for (let { tags = [], paths } of getNonVoidPaths(disjointGeometry)) {
    if (tagsOverride) {
      tags = tagsOverride;
    }
    wireframes.push(taggedPaths({ tags: [...tags, 'path/Wire'] }, paths));
  }
  return wireframes;
};
