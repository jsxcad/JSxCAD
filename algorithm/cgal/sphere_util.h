#include <CGAL/Subdivision_method_3/subdivision_methods_3.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/boost/graph/generators.h>

template <typename K>
static void make_icosphere(CGAL::Surface_mesh<typename K::Point_3>& mesh,
                           typename K::FT radius, size_t subdivisions = 1) {
  typedef typename K::Point_3 Point_3;
  CGAL::make_icosahedron(mesh, Point_3(0, 0, 0), radius);
  for (size_t nth = 0; nth < subdivisions; nth++) {
    CGAL::Subdivision_method_3::Loop_subdivision(mesh);
    // Project each vertex to the sphere.
    for (const auto& vertex : mesh.vertices()) {
      auto point = mesh.point(vertex);
      auto vector = point - Point(0, 0, 0);
      typename K::FT distance =
          CGAL::sqrt(to_double(CGAL::squared_length(vector)));
      mesh.point(vertex) = Point(0, 0, 0) + (radius / distance) * vector;
    }
  }
}
