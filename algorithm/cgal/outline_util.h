#pragma once

void outlinePolygonsWithHoles(const Polygons_with_holes_2& pwhs,
                              const Plane& plane, Segments& segments) {
  for (const Polygon_with_holes_2& polygon : pwhs) {
    for (auto s2 = polygon.outer_boundary().edges_begin();
         s2 != polygon.outer_boundary().edges_end(); ++s2) {
      segments.emplace_back(plane.to_3d(s2->source()),
                            plane.to_3d(s2->target()));
    }
    for (auto hole = polygon.holes_begin(); hole != polygon.holes_end();
         ++hole) {
      for (auto s2 = hole->edges_begin(); s2 != hole->edges_end(); ++s2) {
        segments.emplace_back(plane.to_3d(s2->source()),
                              plane.to_3d(s2->target()));
      }
    }
  }
}

template <typename Surface_mesh, typename Segments>
void outlineSurfaceMesh(const Surface_mesh& mesh, Segments& segments) {
  // FIX: Make this more efficient.
  for (const auto& facet : mesh.faces()) {
    const auto& start = mesh.halfedge(facet);
    if (mesh.is_removed(start)) {
      continue;
    }
    Halfedge_index edge = start;
    do {
      if (!is_coplanar_edge(mesh, mesh.points(), edge)) {
        segments.emplace_back(mesh.point(mesh.source(edge)),
                              mesh.point(mesh.target(edge)));
      }
      const auto& next = mesh.next(edge);
      edge = next;
    } while (edge != start);
  }
}
