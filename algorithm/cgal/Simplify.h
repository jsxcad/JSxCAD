#include "simplify_util.h"

static int Simplify(Geometry* geometry, double face_count, bool simplify_points,
                    double sharp_edge_threshold,
                    bool use_bounded_normal_change_filter = false) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  int sharp_edges = geometry->add(GEOMETRY_SEGMENTS);

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);

    simplify(face_count, sharp_edge_threshold, mesh,
             geometry->segments(sharp_edges));

    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
