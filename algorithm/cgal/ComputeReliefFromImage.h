#include "image_util.h"

static int ComputeReliefFromImage(Geometry* geometry, int x, int y, int z,
                                  uintptr_t data_offset, double angular_bound,
                                  double radius_bound, double distance_bound,
                                  double error_bound, double extrusion) {
  unsigned char* image = reinterpret_cast<unsigned char*>(data_offset);
  int target = geometry->add(GEOMETRY_MESH);
  build_surface_mesh_as_relief_from_graymap(
      x, y, z, image, angular_bound, radius_bound, distance_bound, error_bound,
      extrusion, geometry->mesh(target));
  geometry->setIdentityTransform(target);
  return STATUS_OK;
}
