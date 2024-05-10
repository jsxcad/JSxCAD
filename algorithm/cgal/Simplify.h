#include <CGAL/Constrained_Delaunay_triangulation_2.h>
#include <CGAL/Constrained_triangulation_plus_2.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polyline_simplification_2/Squared_distance_cost.h>
#include <CGAL/Polyline_simplification_2/simplify.h>
#include <CGAL/Projection_traits_xy_3.h>

#include "Geometry.h"
#include "simplify_util.h"

static int Simplify(Geometry* geometry, double face_count, bool simplify_points,
                    double sharp_edge_threshold,
                    bool use_bounded_normal_change_filter = false) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->type(nth)) {
      case GEOMETRY_MESH: {
        auto& mesh = geometry->mesh(nth);
        simplify(face_count, sharp_edge_threshold, mesh);
        demesh(mesh);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        std::cout << "Simplify/polygon: face_count=" << face_count << std::endl;
        typedef CGAL::Polyline_simplification_2::Stop_below_count_threshold
            Stop;
        typedef CGAL::Polyline_simplification_2::Squared_distance_cost Cost;
        auto plane = geometry->plane(nth);
        for (auto& pwh : geometry->pwh(nth)) {
          auto simplified_pwh = CGAL::Polyline_simplification_2::simplify(
              pwh, Cost(), Stop(face_count));
          pwh = std::move(simplified_pwh);
        }
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
