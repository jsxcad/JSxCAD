import { withCgalGeometry } from './cgalGeometry.js';

export const withAabbTreeQuery = (inputs, op) =>
  withCgalGeometry(inputs, (cgalGeometry, g) => {
    cgalGeometry.copyInputMeshesToOutputMeshes();
    cgalGeometry.transformToAbsoluteFrame();
    cgalGeometry.convertPolygonsToPlanarMeshes();
    let query = new g.AabbTreeQuery();
    try {
      query.addGeometry(cgalGeometry);
      op(query, g);
    } finally {
      query.delete();
    }
  });
