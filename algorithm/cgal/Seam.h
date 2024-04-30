#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>

#include "Geometry.h"

static int Seam(Geometry* geometry, size_t count) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        auto& mesh = geometry->mesh(nth);
        for (size_t selection = count; selection < size; selection++) {
          CGAL::Surface_mesh<EK::Point_3> working_selection(
              geometry->mesh(selection));
          CGAL::Polygon_mesh_processing::corefine(
              mesh, working_selection, CGAL::parameters::all_default(),
              CGAL::parameters::all_default());
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
