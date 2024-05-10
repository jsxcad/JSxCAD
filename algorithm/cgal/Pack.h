#pragma once

#include <CGAL/convex_hull_2.h>

#include "point_util.h"
#include "transform_util.h"

static int Pack(Geometry* geometry) {
  try {
    size_t size = geometry->size();

    geometry->copyInputMeshesToOutputMeshes();
    geometry->copyInputSegmentsToOutputSegments();
    geometry->copyInputPointsToOutputPoints();
    geometry->transformToAbsoluteFrame();

    auto add_item = [&](size_t id, std::vector<EK::Point_3>& p3s) {
      std::vector<EK::Point_2> p2s;
      for (auto& p3 : p3s) {
        p2s.emplace_back(p3.x(), p3.y());
      }
      std::vector<EK::Point_2> hull;
      CGAL::convex_hull_2(p2s.begin(), p2s.end(), std::back_inserter(hull));
    };

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH: {
          std::vector<EK::Point_3> points;
          to_points<EK>(geometry->mesh(nth), points);
          add_item(nth, points);
        }
      }
    }

    for (size_t nth = 0; nth < size; nth++) {
      switch (geometry->type(nth)) {
        case GEOMETRY_MESH: {
          break;
        }
      }
    }

  } catch (const std::exception& e) {
    std::cout << "QQ/Pack/exception" << std::endl;
    std::cout << e.what() << std::endl;
    throw;
  }

  return STATUS_OK;
}
