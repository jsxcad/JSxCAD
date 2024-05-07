#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include "Geometry.h"
#include "point_util.h"

static int EachPoint(Geometry* geometry, std::vector<Point>& points) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          to_points<EK>(geometry->mesh(nth), points);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          const auto& plane = geometry->plane(nth);
          for (const auto& polygon : geometry->pwh(nth)) {
            to_points<EK>(polygon, plane, points);
          }
          break;
        }
        case GEOMETRY_SEGMENTS: {
          for (const auto& segment : geometry->segments(nth)) {
            to_points<EK>(segment, points);
          }
          break;
        }
        case GEOMETRY_POINTS: {
          for (const auto& point : geometry->points(nth)) {
            points.push_back(point);
          }
          break;
        }
      }
    }

    // FIX: Remove repeated, rather than unique points?
    unique_points(points);

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "EachPoint: " << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}
