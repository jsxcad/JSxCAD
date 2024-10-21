#include "Geometry.h"

static int Raycast(Geometry* geometry, double x_start, double x_step, double x_end, double y_start, double y_step, double y_end, double z, std::function<void(const IK::Point_3&)>& emit) {
  typedef std::optional<Geometry::Epick_aabb_tree::Intersection_and_primitive_id<IK::Ray_3>::Type> Ray_intersection;

  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->type(nth)) {
      case GEOMETRY_MESH: {
        auto& tree = geometry->epick_aabb_tree(nth);
        for (double x = x_start; x < x_end; x += x_step) {
          for (double y = y_start; y < y_end; y += y_step) {
            IK::Ray_3 ray(IK::Point_3(x, y, z), IK::Vector_3(0, 0, -1));
            Ray_intersection intersection = tree.first_intersection(ray);
            if (intersection) {
              const IK::Point_3 *p = std::get_if<IK::Point_3>(&(intersection->first));
              if (p) {
                emit(*p);
              }
            }
          }
        }
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
