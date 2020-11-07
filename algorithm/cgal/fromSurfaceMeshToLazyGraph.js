import { getCgal } from './getCgal.js';

export const fromSurfaceMeshToLazyGraph = (mesh) => {
  const c = getCgal();
  const graph = {
    isClosed: c.Surface_mesh__is_closed(mesh),
    isLazy: true,
  };
  return graph;
};
