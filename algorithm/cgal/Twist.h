#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/triangulate_faces.h>
#include <CGAL/rational_rotation.h>

#include "Geometry.h"

static int Twist(Geometry* geometry, double turns_per_mm) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    CGAL::Polygon_mesh_processing::triangulate_faces(mesh);

    // This does not look very efficient.
    // CHECK: Figure out deformations.
    for (const auto& vertex : mesh.vertices()) {
      if (mesh.is_removed(vertex)) {
        continue;
      }
      auto& point = mesh.point(vertex);
      EK::FT radians = CGAL::to_double(point.z()) * turns_per_mm * CGAL_PI;
      EK::RT sin_alpha, cos_alpha, w;
      CGAL::rational_rotation_approximation(CGAL::to_double(radians.exact()),
                                            sin_alpha, cos_alpha, w, EK::RT(1),
                                            EK::RT(1000));
      CGAL::Aff_transformation_3<EK> transformation(cos_alpha, sin_alpha, 0, 0,
                                                    -sin_alpha, cos_alpha, 0, 0,
                                                    0, 0, w, 0, w);
      point = point.transform(transformation);
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
