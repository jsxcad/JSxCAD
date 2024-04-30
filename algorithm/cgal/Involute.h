#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>

#include "Geometry.h"

static int Involute(Geometry* geometry) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        CGAL::Polygon_mesh_processing::reverse_face_orientations(
            geometry->mesh(nth));
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        geometry->plane(nth) = geometry->plane(nth).opposite();
        // Why are we reflecting along y?
        for (auto& polygon : geometry->pwh(nth)) {
          for (auto& point : polygon.outer_boundary()) {
            point = EK::Point_2(point.x(), point.y() * -1);
          }
          for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
               ++hole) {
            for (auto& point : *hole) {
              point = EK::Point_2(point.x(), point.y() * -1);
            }
          }
        }
        break;
      }
    }
  }
  return STATUS_OK;
}
