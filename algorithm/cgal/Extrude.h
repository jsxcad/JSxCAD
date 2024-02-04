int Extrude(Geometry* geometry, size_t count) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  typedef typename boost::property_map<Surface_mesh, CGAL::vertex_point_t>::type
      VPMap;

  const Transformation& top = geometry->transform(count);
  const Transformation& bottom = geometry->transform(count + 1);

  Vector up = Point(0, 0, 0).transform(top) - Point(0, 0, 0);
  Vector down = Point(0, 0, 0).transform(bottom) - Point(0, 0, 0);

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        if (CGAL::is_closed(mesh) || CGAL::is_empty(mesh)) {
          // TODO: Support extrusion of an upper envelope of a solid.
          continue;
        }
        // No protection against self-intersection.
        std::unique_ptr<Surface_mesh> extruded_mesh(new Surface_mesh);
        Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
        Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
        CGAL::Polygon_mesh_processing::extrude_mesh(mesh, *extruded_mesh,
                                                    bottom, top);
        CGAL::Polygon_mesh_processing::triangulate_faces(*extruded_mesh);
        FT volume = CGAL::Polygon_mesh_processing::volume(
            *extruded_mesh, CGAL::parameters::all_default());
        if (volume == 0) {
          std::cout << "Extrude/zero-volume" << std::endl;
          continue;
        } else if (volume < 0) {
          CGAL::Polygon_mesh_processing::reverse_face_orientations(
              *extruded_mesh);
        }
        geometry->setMesh(nth, extruded_mesh);
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        // We do each pwh separately to avoid zero width junctions.
        for (const auto& pwh : geometry->pwh(nth)) {
          Polygons_with_holes_2 one_pwh = {pwh};
          Surface_mesh flat_mesh;
          Vertex_map vertex_map;
          if (!PolygonsWithHolesToSurfaceMesh(geometry->plane(nth), one_pwh,
                                              flat_mesh, vertex_map)) {
            std::cout << "Conversion of polygons to mesh failed" << std::endl;
            continue;
          }
          if (CGAL::is_empty(flat_mesh)) {
            std::cout << "Conversion of polygons produced empty mesh"
                      << std::endl;
            continue;
          }
          if (CGAL::is_closed(flat_mesh)) {
            std::cout << "Conversion of polygons produced closed mesh"
                      << std::endl;
            continue;
          }
          std::unique_ptr<Surface_mesh> extruded_mesh(new Surface_mesh);
          Project<VPMap> top(get(CGAL::vertex_point, *extruded_mesh), up);
          Project<VPMap> bottom(get(CGAL::vertex_point, *extruded_mesh), down);
          CGAL::Polygon_mesh_processing::extrude_mesh(flat_mesh, *extruded_mesh,
                                                      bottom, top);
          CGAL::Polygon_mesh_processing::triangulate_faces(*extruded_mesh);
          FT volume = CGAL::Polygon_mesh_processing::volume(
              *extruded_mesh, CGAL::parameters::all_default());
          if (volume == 0) {
            std::cout << "Extrude/zero-volume" << std::endl;
            continue;
          } else if (volume < 0) {
            CGAL::Polygon_mesh_processing::reverse_face_orientations(
                *extruded_mesh);
          }
          int extrusion = geometry->add(GEOMETRY_MESH);
          geometry->origin(extrusion) = nth;
          geometry->copyTransform(extrusion, geometry->transform(nth));
          geometry->setMesh(extrusion, extruded_mesh);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  geometry->removeEmptyMeshes();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
