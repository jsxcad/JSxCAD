#pragma once

#include "Geometry.h"

static int EachTriangle(Geometry* geometry, std::vector<Point>& points) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    const auto& mesh = geometry->mesh(nth);
    for (const auto facet : mesh.faces()) {
      const auto& a = mesh.halfedge(facet);
      const auto& b = mesh.next(a);
      const auto& c = mesh.next(b);
      points.push_back(mesh.point(mesh.source(a)));
      points.push_back(mesh.point(mesh.source(b)));
      points.push_back(mesh.point(mesh.source(c)));
    }
  }

  geometry->clear();

  return STATUS_OK;
}
