#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/repair_polygon_soup.h>
#include <CGAL/Polygon_mesh_processing/repair_self_intersections.h>

#include "./approximate_util.h"
#include "./repair_util.h"

static int FromPolygonSoup(Geometry* geometry, size_t face_count,
                           double min_error_drop,
                           const std::vector<int>& strategies) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef std::vector<std::size_t> Polygon;

  size_t size = geometry->size();

  try {
    int target = geometry->add(GEOMETRY_MESH);
    auto& mesh = geometry->mesh(target);
    geometry->setIdentityTransform(target);

    {
      std::vector<EK::Point_3> points;
      std::vector<Polygon> polygons;
      for (size_t nth = 0; nth < size; nth++) {
        Polygon polygon;
        for (const auto& point : geometry->input_points(nth)) {
          polygon.push_back(points.size());
          points.push_back(point);
        }
        polygons.push_back(std::move(polygon));
      }

      CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);
      CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
      CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(
          points, polygons, mesh);

      assert(CGAL::Polygon_mesh_processing::triangulate_faces(mesh) == true);

      if (CGAL::is_closed(mesh)) {
        CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(mesh);
      }
    }

    assert(repair_self_intersections<EK>(mesh, strategies));

    if (face_count > 0 || min_error_drop > 0) {
      // Simplify the non-self-intersecting mesh.
      // Enable simplification to reduce polygon count.
      if (!approximate_mesh(mesh, face_count, min_error_drop)) {
        return STATUS_FAILED;
      }
    }

    demesh(mesh);
  } catch (const std::exception& e) {
    std::cout << "FromPolygonSoup: " << e.what() << std::endl;
    throw;
  }
  return STATUS_OK;
}
