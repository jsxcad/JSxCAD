#include "simplify_util.h"

int Simplify(Geometry* geometry, double corner_threshold, bool simplify_points,
             double eps, bool use_bounded_normal_change_filter = false) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);

    simplify(corner_threshold, mesh, use_bounded_normal_change_filter);

    if (simplify_points) {
      for (const Vertex_index vertex : mesh.vertices()) {
        Point& point = mesh.point(vertex);
        double x = CGAL::to_double(point.x());
        double y = CGAL::to_double(point.y());
        double z = CGAL::to_double(point.z());
        point =
            Point(CGAL::simplest_rational_in_interval<FT>(x - eps, x + eps),
                  CGAL::simplest_rational_in_interval<FT>(y - eps, y + eps),
                  CGAL::simplest_rational_in_interval<FT>(z - eps, z + eps));
      }
    }

    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
