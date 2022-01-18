import { getCgal } from './getCgal.js';

export const fromSurfaceMeshToLazyGraph = (mesh) => {
  try {
    const c = getCgal();
    const graph = {
      isClosed: c.Surface_mesh__is_closed(mesh),
      isEmpty: c.Surface_mesh__is_empty(mesh),
      isLazy: true,
      provenance: 'algorithm/cgal/fromSurfaceMeshToLazyGraph',
    };
    return graph;
  } catch (error) {
    throw Error(error);
  }
};
