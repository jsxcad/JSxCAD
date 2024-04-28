#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Nef_polyhedron_3.h>
#include <CGAL/boost/graph/convert_nef_polyhedron_to_polygon_mesh.h>
#include <CGAL/minkowski_sum_3.h>

#include "Geometry.h"

static int DilateXY(Geometry* geometry, double amount) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Nef_polyhedron_3<EK> Nef_polyhedron;

  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  Nef_polyhedron tool;
  // Build a rough circle in XY.
  {
    typedef std::vector<EK::Point_3>::iterator point_iterator;
    typedef std::pair<point_iterator, point_iterator> point_range;
    typedef std::list<point_range> polyline;

    const double segments = 16;
    std::vector<EK::Point_3> points;
    for (double a = 0; a < CGAL_PI * 2; a += CGAL_PI / segments) {
      points.emplace_back(compute_approximate_point_value(sin(-a) * amount),
                          compute_approximate_point_value(cos(-a) * amount), 0);
    }
    polyline poly;
    poly.push_back(point_range(points.begin(), points.end()));
    tool = Nef_polyhedron(poly.begin(), poly.end(),
                          Nef_polyhedron::Polylines_tag());
  }

  for (size_t nth = 0; nth < size; nth++) {
    if (geometry->type(nth) != GEOMETRY_MESH) {
      continue;
    }
    auto& mesh = geometry->mesh(nth);
    Nef_polyhedron nef(mesh);
    Nef_polyhedron result = CGAL::minkowski_sum_3(nef, tool);
    mesh.clear();
    CGAL::convert_nef_polyhedron_to_polygon_mesh(result, mesh, true);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
