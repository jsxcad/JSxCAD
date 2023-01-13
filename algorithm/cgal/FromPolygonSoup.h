int FromPolygonSoup(Geometry* geometry, emscripten::val fill) {
  Points points;
  Polygons polygons;
  std::cout << "QQ/FromPolygonSoup/1" << std::endl;
  {
    Triples triples;
    // Workaround for emscripten::val() bindings.
    Triples* triples_ptr = &triples;
    Polygons* polygons_ptr = &polygons;
    fill(triples_ptr, polygons_ptr);
    for (const Triple& triple : triples) {
      points.push_back(Point(triple[0], triple[1], triple[2]));
    }
  }

  std::cout << "QQ/FromPolygonSoup/2" << std::endl;
  CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);
  std::cout << "QQ/FromPolygonSoup/3" << std::endl;
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);

  std::cout << "QQ/FromPolygonSoup/4" << std::endl;
  int target = geometry->add(GEOMETRY_MESH);
  Surface_mesh& mesh = geometry->mesh(target);
  geometry->setIdentityTransform(target);

  std::cout << "QQ/FromPolygonSoup/5" << std::endl;
  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons, mesh);

  std::cout << "QQ/FromPolygonSoup/6" << std::endl;
  bool failed = false;
  while (!failed && !CGAL::is_closed(mesh)) {
    for (const Surface_mesh::Halfedge_index edge : mesh.halfedges()) {
      if (mesh.is_border(edge)) {
        std::vector<Face_index> faces;
        CGAL::Polygon_mesh_processing::triangulate_hole(
            mesh, edge, std::back_inserter(faces),
            CGAL::parameters::use_2d_constrained_delaunay_triangulation(
                false));
        if (faces.empty()) {
          failed = true;
        }
        break;
      }
    }
  }
  if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
    std::cout << "QQ/FromPolygonSoup/7" << std::endl;
    CGAL::Polygon_mesh_processing::experimental::
        autorefine_and_remove_self_intersections(mesh);
    std::cout << "QQ/FromPolygonSoup/8" << std::endl;
  }

  std::cout << "QQ/FromPolygonSoup/9" << std::endl;

  CGAL::Polygon_mesh_processing::orient_to_bound_a_volume(mesh);

  std::cout << "QQ/FromPolygonSoup/10" << std::endl;

  demesh(mesh);

  std::cout << "QQ/FromPolygonSoup/11" << std::endl;

  return STATUS_OK;
}
