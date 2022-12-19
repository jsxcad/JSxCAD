int Simplify(Geometry* geometry, double ratio, bool simplify_points,
             double eps) {
  size_t size = geometry->getSize();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < size; nth++) {
    if (!geometry->is_mesh(nth)) {
      continue;
    }
    Surface_mesh& mesh = geometry->mesh(nth);
    boost::unordered_map<Vertex_index, Cartesian_surface_mesh::Vertex_index>
        vertex_map;

    Cartesian_surface_mesh cartesian_surface_mesh;
    copy_face_graph(mesh, cartesian_surface_mesh,
                    CGAL::parameters::vertex_to_vertex_output_iterator(
                        std::inserter(vertex_map, vertex_map.end())));

    CGAL::Surface_mesh_simplification::Count_ratio_stop_predicate<
        Cartesian_surface_mesh>
        stop(ratio);

    CGAL::get_default_random() = CGAL::Random(0);
    std::srand(0);

    CGAL::Surface_mesh_simplification::edge_collapse(cartesian_surface_mesh,
                                                     stop);

    mesh.clear();
    copy_face_graph(cartesian_surface_mesh, mesh,
                    CGAL::parameters::vertex_to_vertex_map(
                        boost::make_assoc_property_map(vertex_map)));

    if (simplify_points) {
      for (const Vertex_index vertex : mesh.vertices()) {
        Point& point = mesh.point(vertex);
        double x = CGAL::to_double(point.x());
        double y = CGAL::to_double(point.y());
        double z = CGAL::to_double(point.z());
        point =
            Point(CGAL::simplest_rational_in_interval<FT>(x - eps, x + eps),
                  CGAL::simplest_rational_in_interval<FT>(y - eps, y + eps),
                  CGAL::simplest_rational_in_interval<FT>(z - eps, z + eps));
      }
    }
    demesh(mesh);
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
