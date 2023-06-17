#include "simplify_util.h"

int Simplify(Geometry* geometry, double ratio, bool simplify_points,
             double eps) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);

    simplify(ratio, mesh);

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
