#include "Geometry.h"
#include "repair_util.h"

static int Repair(Geometry* geometry, const std::vector<int>& strategies) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    auto& mesh = geometry->mesh(nth);
    repair_self_intersections<Epeck_kernel>(mesh, strategies);
    std::cout << "QQ/Repair/demesh/begin" << std::endl;
    demesh(mesh);
    std::cout << "QQ/Repair/demesh/done" << std::endl;
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
