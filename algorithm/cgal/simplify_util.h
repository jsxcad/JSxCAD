#pragma once

void simplify(double ratio, Surface_mesh& mesh) {
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
}
