#include "wrap_util.h"

int Wrap(Geometry* geometry, double alpha, double offset) {
  try {
    CGAL::Cartesian_converter<Kernel, Epick_kernel> to_cartesian;

    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();
    geometry->convertPlanarMeshesToPolygons();

    Epick_points points;
    std::vector<std::vector<size_t>> faces;

    for (int nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          wrap_add_mesh_epick(to_cartesian, geometry->mesh(nth), points, faces);
          break;
        }
        case GEOMETRY_POLYGONS_WITH_HOLES: {
          wrap_add_polygons_with_holes_2_epick(to_cartesian, geometry->pwh(nth),
                                               geometry->plane(nth), points,
                                               faces);
          break;
        }
        case GEOMETRY_SEGMENTS: {
          wrap_add_segments_epick(to_cartesian, geometry->segments(nth), points,
                                  faces);
          break;
        }
        case GEOMETRY_POINTS: {
          wrap_add_points_epick(to_cartesian, geometry->points(nth), points);
          break;
        }
      }
    }

    int target = geometry->add(GEOMETRY_MESH);
    geometry->setIdentityTransform(target);
    wrap_epick(points, faces, alpha, offset, geometry->mesh(target));

    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << e.what() << std::endl;
    throw;
  }
}
