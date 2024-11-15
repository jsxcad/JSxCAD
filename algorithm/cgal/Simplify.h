#include <CGAL/Constrained_Delaunay_triangulation_2.h>
#include <CGAL/Constrained_triangulation_plus_2.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_2.h>
#include <CGAL/Polyline_simplification_2/Squared_distance_cost.h>
#include <CGAL/Polyline_simplification_2/simplify.h>
#include <CGAL/Projection_traits_xy_3.h>

#include "Geometry.h"
#include "simplify_util.h"

template <typename K>
static bool repair_simplify(CGAL::Surface_mesh<typename K::Point_3>& mesh, bool conservative = true) {
  CGAL::Polygon_mesh_processing::remove_connected_components_of_negligible_size(mesh);
  repair_degeneracies<K>(mesh);
  repair_manifold<K>(mesh);
  assert(number_of_non_manifold_vertices(mesh) == 0);
  if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
    std::cout << "repair_boolean: autorefine" << std::endl;
    CGAL::Polygon_mesh_processing::autorefine(mesh);
    if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
      return false;
    }
#if 0
    if (!CGAL::Polygon_mesh_processing::experimental::remove_self_intersections(mesh)) {
      return false;
    }
#endif
  }
  return true;
}

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
        repair_simplify<EK>(mesh);
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
