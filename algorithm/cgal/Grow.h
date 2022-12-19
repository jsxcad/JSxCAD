int Grow(Geometry* geometry, size_t count, bool x, bool y, bool z) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();

  Point reference = Point(0, 0, 0).transform(geometry->transform(count));
  FT amount = reference.z();

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Surface_mesh& mesh = geometry->mesh(nth);
        for (int selection = count + 1; selection < size; selection++) {
          if (!geometry->is_mesh(selection)) {
            continue;
          }
          Surface_mesh working_selection(geometry->mesh(selection));
          CGAL::Polygon_mesh_processing::corefine(
              mesh, working_selection, CGAL::parameters::all_default(),
              CGAL::parameters::all_default());
        }
        bool created = false;
        Surface_mesh::Property_map<Vertex_index, Vector> vertex_normal_map;
        std::tie(vertex_normal_map, created) =
            mesh.add_property_map<Vertex_index, Vector>("v:normal_map",
                                                        CGAL::NULL_VECTOR);

        if (created) {
          CGAL::Polygon_mesh_processing::compute_vertex_normals(
              mesh, vertex_normal_map,
              CGAL::Polygon_mesh_processing::parameters::vertex_point_map(
                  mesh.points())
                  .geom_traits(Kernel()));
        }

        for (const Vertex_index vertex : mesh.vertices()) {
          const Point& point = mesh.point(vertex);
          // By default all points are grown.
          bool inside = true;
          if (count + 1 < size) {
            inside = false;
            for (int selection = count + 1; selection < size; selection++) {
              if (geometry->on_side(selection)(point) !=
                  CGAL::ON_UNBOUNDED_SIDE) {
                inside = true;
                break;
              }
            }
          }
          if (!inside) {
            // There were selections provided, but the point wasn't in any of
            // them.
            continue;
          }
          const Vector& n = vertex_normal_map[vertex];
          Vector direction =
              unitVector(Vector(x ? n.x() : 0, y ? n.y() : 0, z ? n.z() : 0));
          mesh.point(vertex) = point + direction * amount;
        }
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->convertPlanarMeshesToPolygons();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
