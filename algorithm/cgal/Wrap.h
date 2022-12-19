int Wrap(Geometry* geometry, double alpha, double offset) {
  typedef CGAL::Cartesian_converter<Kernel, Epick_kernel> converter;
  converter to_cartesian;

  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();

  Epick_points points;
  std::vector<std::vector<size_t>> faces;

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        const Surface_mesh& mesh = geometry->mesh(nth);
        for (const Face_index face : mesh.faces()) {
          Halfedge_index a = mesh.halfedge(face);
          Halfedge_index b = mesh.next(a);
          Halfedge_index c = mesh.next(b);
          size_t index = points.size();
          faces.push_back({index, index + 1, index + 2});
          points.push_back(to_cartesian(mesh.point(mesh.source(a))));
          points.push_back(to_cartesian(mesh.point(mesh.source(b))));
          points.push_back(to_cartesian(mesh.point(mesh.source(c))));
        }
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulator;
        for (const auto& polygon : geometry->pwh(nth)) {
          std::vector<Polygon_2> triangles;
          triangulator(polygon, std::back_inserter(triangles));
          for (const Polygon_2& triangle : triangles) {
            size_t index = points.size();
            faces.push_back({index, index + 1, index + 2});
            points.push_back(to_cartesian(plane.to_3d(triangle[0])));
            points.push_back(to_cartesian(plane.to_3d(triangle[1])));
            points.push_back(to_cartesian(plane.to_3d(triangle[2])));
          }
        }
        break;
      }
      case GEOMETRY_SEGMENTS: {
        for (Segment s3 : geometry->segments(nth)) {
          points.push_back(to_cartesian(s3.source()));
          points.push_back(to_cartesian(s3.target()));
        }
        break;
      }
      case GEOMETRY_POINTS: {
        for (Point p3 : geometry->points(nth)) {
          points.push_back(to_cartesian(p3));
        }
        break;
      }
    }
  }

  Epick_surface_mesh epick_mesh;
  if (faces.empty()) {
    alpha_wrap_3(points, alpha, offset, epick_mesh);
  } else {
    alpha_wrap_3(points, faces, alpha, offset, epick_mesh);
  }

  int target = geometry->add(GEOMETRY_MESH);
  geometry->setIdentityTransform(target);
  copy_face_graph(epick_mesh, geometry->mesh(target));

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
