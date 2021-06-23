import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { splitSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { taggedGroup } from '../tagged/taggedGroup.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const split = (
  geometry,
  keepVolumes = true,
  keepCavitiesInVolumes = true,
  keepCavitiesAsVolumes = false
) =>
  taggedGroup(
    {},
    ...splitSurfaceMesh(
      toSurfaceMesh(geometry.graph),
      keepVolumes,
      keepCavitiesInVolumes,
      keepCavitiesAsVolumes
    ).map((mesh) =>
      taggedGraph(
        { tags: geometry.tags, matrix: geometry.matrix },
        fromSurfaceMeshLazy(mesh)
      )
    )
  );
