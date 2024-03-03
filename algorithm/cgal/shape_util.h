#pragma once

#include <CGAL/boost/graph/generators.h>

template <typename Surface_mesh>
static int make_box_from_bbox_3(CGAL::bbox_3 b, Surface_mesh& mesh) {
  typedef Surface_mesh::Point P;
  make_hexahedron(P(b.xmin(), b.ymin(), b.zmin()),  // 0
                  P(b.xmax(), b.ymin(), b.zmin()),  // 1
                  P(b.xmax(), b.ymax(), b.zmin()),  // 3
                  P(b.xmin(), b.ymax(), b.zmin()),  // 4
                  P(b.xmin(), b.ymin(), b.zmax()),  // 5
                  P(b.xmax(), b.ymin(), b.zmax()),  // 6
                  P(b.xmax(), b.ymax(), b.zmax()),  // 7
                  mesh);
}
