int FromPolygonSoup(Geometry* geometry, emscripten::val fill) {
  Points points;
  Polygons polygons;
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

  CGAL::Polygon_mesh_processing::repair_polygon_soup(points, polygons);
  CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);

  int target = geometry->add(GEOMETRY_MESH);
  Surface_mesh& mesh = geometry->mesh(target);
  geometry->setIdentityTransform(target);

  CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons,
                                                              mesh);

  bool failed = false;
  while (!failed && !CGAL::is_closed(mesh)) {
    for (const Surface_mesh::Halfedge_index edge : mesh.halfedges()) {
      if (mesh.is_border(edge)) {
        std::vector<Face_index> faces;
        CGAL::Polygon_mesh_processing::triangulate_hole(
            mesh, edge, std::back_inserter(faces),
            CGAL::parameters::use_2d_constrained_delaunay_triangulation(false));
        if (faces.empty()) {
          failed = true;
        }
        break;
      }
    }
  }
  if (CGAL::Polygon_mesh_processing::does_self_intersect(mesh)) {
    CGAL::Polygon_mesh_processing::experimental::
        autorefine_and_remove_self_intersections(mesh);
  }

  demesh(mesh);

  if (CGAL::Polygon_mesh_processing::volume(
          mesh, CGAL::parameters::all_default()) < 0) {
    CGAL::Polygon_mesh_processing::reverse_face_orientations(mesh);
  }

  return STATUS_OK;
}
