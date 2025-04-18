#pragma once

#include "Geometry.h"
#include "surface_mesh_util.h"

static int Raycast(
    Geometry* geometry, double x_start, double x_stride, size_t x_steps,
    double y_start, double y_stride, size_t y_steps, double z,
    const std::function<void(size_t x_step, size_t y_step, const IK::FT&,
                             const IK::Vector_3&)>& emit) {
  typedef std::optional<
      Geometry::Epick_aabb_tree::Intersection_and_primitive_id<IK::Ray_3>::Type>
      Ray_intersection;

  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->type(nth)) {
      case GEOMETRY_MESH: {
        auto& mesh = geometry->epick_mesh(nth);
        auto& tree = geometry->epick_aabb_tree(nth);
        size_t x_step = 0;
        for (double x = x_start; x_step < x_steps; x += x_stride, x_step++) {
          size_t y_step = 0;
          for (double y = y_start; y_step < y_steps; y += y_stride, y_step++) {
            IK::Ray_3 ray(IK::Point_3(x, y, z), IK::Vector_3(0, 0, -1));
            Ray_intersection intersection = tree.first_intersection(ray);
            if (intersection) {
              const IK::Point_3* p =
                  std::get_if<IK::Point_3>(&(intersection->first));
              if (p) {
                // We need to compute the normal
                CGAL::Surface_mesh<IK::Point_3>::Face_index facet =
                    intersection->second;
                IK::Vector_3 normal = NormalOfSurfaceMeshFacet<IK>(mesh, facet);
                emit(x_step, y_step, p->z(), normal);
              }
            } else {
              // Express it as a non-reflective strike at the projector.
              emit(x_step, y_step, z, IK::Vector_3(0, 0, -1));
            }
          }
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
