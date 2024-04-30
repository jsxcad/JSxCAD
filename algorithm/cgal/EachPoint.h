#include "Geometry.h"

static int EachPoint(Geometry* geometry, std::vector<Point>& points) {
  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          const auto& mesh = geometry->mesh(nth);
          for (const auto vertex : mesh.vertices()) {
            points.push_back(mesh.point(vertex));
          }
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          const auto& plane = geometry->plane(nth);
          for (const auto& polygon : geometry->pwh(nth)) {
            for (const auto& point : polygon.outer_boundary()) {
              points.push_back(plane.to_3d(point));
            }
            for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
                 ++hole) {
              for (const auto& point : *hole) {
                points.push_back(plane.to_3d(point));
              }
            }
          }
          break;
        }
        case GEOMETRY_SEGMENTS: {
          for (const auto& segment : geometry->segments(nth)) {
            points.push_back(segment.source());
            points.push_back(segment.target());
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

    unique_points(points);

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "QQ/EachPoint/exception" << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }
}
