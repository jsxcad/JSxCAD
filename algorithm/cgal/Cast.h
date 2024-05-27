#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

#include "Geometry.h"
#include "cast_util.h"

// REVIEW: Should we keep this?
static int Cast(Geometry* geometry) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  EK::Plane_3 reference_plane =
      EK::Plane_3(0, 0, 1, 0).transform(geometry->transform(0));
  EK::Point_3 reference_point =
      EK::Point_3(0, 0, 0).transform(geometry->transform(1));
  EK::Vector_3 reference_vector = reference_point - EK::Point_3(0, 0, 0);

  int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
  geometry->plane(target) = reference_plane;
  geometry->setIdentityTransform(target);

  for (int nth = 2; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        cast_mesh_to_gps(geometry->mesh(nth), reference_plane, reference_vector,
                         geometry->gps(target));
#if 0
        Surface_mesh& mesh = geometry->mesh(nth);
        Surface_mesh projected_mesh(mesh);
        auto& input_map = mesh.points();
        auto& output_map = projected_mesh.points();
        // Squash the mesh.
        for (auto vertex : mesh.vertices()) {
          const EK::Line_3 line(get(input_map, vertex),
                                get(input_map, vertex) + reference_vector);
          auto result = CGAL::intersection(line, reference_plane);
          if (result) {
            if (EK::Point_3* point = std::get_if<EK::Point_3>(&*result)) {
              put(output_map, vertex, *point);
            }
          }
        }
        PlanarSurfaceMeshFacetsToPolygonSet(reference_plane, projected_mesh,
                                            geometry->gps(target));
#endif
      }
    }
  }

  geometry->copyGeneralPolygonSetsToPolygonsWithHoles();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
