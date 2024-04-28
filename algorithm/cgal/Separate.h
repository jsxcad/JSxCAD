#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/connected_components.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Side_of_triangle_mesh.h>
#include <CGAL/Surface_mesh.h>

#include "Geometry.h"

static int Separate(Geometry* geometry, bool keep_shapes,
                    bool keep_holes_in_shapes, bool keep_holes_as_shapes) {
  typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  int size = geometry->size();

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const auto& input_mesh = geometry->input_mesh(nth);
        if (!CGAL::is_closed(input_mesh)) {
          continue;
        }

        std::vector<Surface_mesh> meshes;
        std::vector<Surface_mesh> cavities;
        std::vector<Surface_mesh> volumes;
        CGAL::Polygon_mesh_processing::split_connected_components(input_mesh,
                                                                  meshes);

        // CHECK: Can we leverage volume_connected_components() here?
        for (auto& mesh : meshes) {
          // CHECK: Do we have an expensive move here?
          if (CGAL::Polygon_mesh_processing::is_outward_oriented(mesh)) {
            volumes.push_back(mesh);
          } else {
            cavities.push_back(mesh);
          }
        }

        if (keep_shapes) {
          for (auto& mesh : volumes) {
            if (keep_holes_in_shapes) {
              CGAL::Side_of_triangle_mesh<Surface_mesh, EK> inside(mesh);
              for (auto& cavity : cavities) {
                for (const auto vertex : cavity.vertices()) {
                  if (inside(cavity.point(vertex)) == CGAL::ON_BOUNDED_SIDE) {
                    // Include the cavity in the mesh.
                    mesh.join(cavity);
                  }
                  // A single test is sufficient.
                  break;
                }
              }
            }
            int target = geometry->add(GEOMETRY_MESH);
            geometry->setMesh(target, new Surface_mesh(mesh));
            geometry->setTransform(target, geometry->transform(nth));
          }
        }

        if (keep_holes_as_shapes) {
          for (auto& mesh : cavities) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
            int target = geometry->add(GEOMETRY_MESH);
            geometry->setMesh(target, new Surface_mesh(mesh));
            geometry->setTransform(target, geometry->transform(nth));
          }
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (const auto& polygon : geometry->pwh(nth)) {
          if (keep_shapes) {
            int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
            geometry->setTransform(target, geometry->transform(nth));
            geometry->plane(target) = geometry->plane(nth);
            if (keep_holes_in_shapes) {
              geometry->pwh(target).push_back(polygon);
            } else {
              geometry->pwh(target).emplace_back(polygon.outer_boundary());
            }
          }

          if (keep_holes_as_shapes) {
            for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
                 ++hole) {
              int target = geometry->add(GEOMETRY_POLYGONS_WITH_HOLES);
              geometry->setTransform(target, geometry->transform(nth));
              geometry->plane(target) = geometry->plane(nth);
              auto shape = *hole;
              shape.reverse_orientation();
              geometry->pwh(target).emplace_back(shape);
            }
          }
        }
        break;
      }
    }
  }

  return STATUS_OK;
}
