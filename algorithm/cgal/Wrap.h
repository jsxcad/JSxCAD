#include <CGAL/Cartesian_converter.h>
#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/bbox.h>

#include "approximate_util.h"
#include "wrap_util.h"

static int Wrap(Geometry* geometry, double alpha, double offset,
                size_t face_count, double min_error_drop) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;
  try {
    CGAL::Cartesian_converter<EK, IK> to_cartesian;

    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();
    geometry->convertPlanarMeshesToPolygons();

    std::vector<IK::Point_3> points;
    std::vector<std::vector<size_t>> faces;

    CGAL::Bbox_3 bbox;

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->getType(nth)) {
        case GEOMETRY_MESH: {
          bbox += CGAL::Polygon_mesh_processing::bbox(geometry->mesh(nth));
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

    if (alpha == 0) {
      double wrap_relative_alpha = 300;
      double wrap_relative_offset = 5000;
      wrap_compute_alpha_and_offset(bbox, wrap_relative_alpha,
                                    wrap_relative_offset, alpha, offset);
    }

    wrap_epick(points, faces, alpha, offset, geometry->mesh(target));

    if (face_count > 0) {
      std::cout << "Wrap/approximate: face_count=" << face_count
                << " min_error_drop=" << min_error_drop << std::endl;
      approximate_mesh(geometry->mesh(target), face_count, min_error_drop);
      geometry->copyEpickMeshToEpeckMesh(target);
      std::cout << "Wrap/approximate: number_of_faces="
                << geometry->mesh(target).number_of_faces() << std::endl;
    }

    geometry->transformToLocalFrame();

    return STATUS_OK;
  } catch (const std::exception& e) {
    std::cout << e.what() << std::endl;
    throw;
  }
}
