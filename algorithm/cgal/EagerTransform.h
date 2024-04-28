#include <CGAL/Polygon_mesh_processing/transform.h>

#include "Geometry.h"
#include "transform_util.h"
#include "unit_util.h"

static int EagerTransform(Geometry* geometry, int count) {
  try {
    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();

    const auto& transform = geometry->transform(count);

    for (int nth = 0; nth < count; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          if (geometry->has_mesh(nth)) {
            CGAL::Polygon_mesh_processing::transform(
                transform, geometry->mesh(nth),
                CGAL::parameters::all_default());
          }
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          auto transformed_plane =
              unitPlane<Kernel>(geometry->plane(nth).transform(transform));
          transformPolygonsWithHoles(geometry->pwh(nth), geometry->plane(nth),
                                     transformed_plane, transform);
          geometry->plane(nth) = transformed_plane;
          break;
        }
        case GEOMETRY_POINTS: {
          transformPoints(geometry->points(nth), transform);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          transformSegments(geometry->segments(nth), transform);
          break;
        }
        case GEOMETRY_EDGES: {
          transformEdges(geometry->edges(nth), transform);
          break;
        }
        case GEOMETRY_REFERENCE: {
          geometry->setTransform(nth, transform * geometry->transform(nth));
          break;
        }
      }
    }

    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << "QQ/EagerTransform failed: " << e.what() << std::endl;
    throw;
  }
}
