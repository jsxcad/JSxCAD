#pragma once

void wrap_compute_alpha_and_offset(const CGAL::Bbox_3& bbox,
                                   double relative_alpha,
                                   double relative_offset, double& alpha,
                                   double& offset) {
  const double diag_length = std::sqrt(CGAL::square(bbox.xmax() - bbox.xmin()) +
                                       CGAL::square(bbox.ymax() - bbox.ymin()) +
                                       CGAL::square(bbox.zmax() - bbox.zmin()));
  alpha = diag_length / relative_alpha;
  offset = diag_length / relative_offset;
}

void wrap_add_mesh_epeck(const Surface_mesh& mesh, Points& points,
                         std::vector<std::vector<size_t>>& faces) {
  for (const Face_index face : mesh.faces()) {
    Halfedge_index a = mesh.halfedge(face);
    Halfedge_index b = mesh.next(a);
    Halfedge_index c = mesh.next(b);
    size_t index = points.size();
    faces.push_back({index, index + 1, index + 2});
    points.push_back(mesh.point(mesh.source(a)));
    points.push_back(mesh.point(mesh.source(b)));
    points.push_back(mesh.point(mesh.source(c)));
  }
}

void wrap_add_mesh_epick(
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_epick,
    const Surface_mesh& mesh, Epick_points& points,
    std::vector<std::vector<size_t>>& faces) {
  for (const Face_index face : mesh.faces()) {
    Halfedge_index a = mesh.halfedge(face);
    Halfedge_index b = mesh.next(a);
    Halfedge_index c = mesh.next(b);
    size_t index = points.size();
    faces.push_back({index, index + 1, index + 2});
    points.push_back(to_epick(mesh.point(mesh.source(a))));
    points.push_back(to_epick(mesh.point(mesh.source(b))));
    points.push_back(to_epick(mesh.point(mesh.source(c))));
  }
}

void wrap_add_polygons_with_holes_2_epeck(
    const Polygons_with_holes_2& polygons, const Plane& plane, Points& points,
    std::vector<std::vector<size_t>>& faces) {
  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulator;
  for (const auto& polygon : polygons) {
    std::vector<Polygon_2> triangles;
    triangulator(polygon, std::back_inserter(triangles));
    for (const Polygon_2& triangle : triangles) {
      size_t index = points.size();
      faces.push_back({index, index + 1, index + 2});
      points.push_back(plane.to_3d(triangle[0]));
      points.push_back(plane.to_3d(triangle[1]));
      points.push_back(plane.to_3d(triangle[2]));
    }
  }
}

void wrap_add_polygons_with_holes_2_epick(
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_epick,
    const Polygons_with_holes_2& polygons, const Plane& plane,
    Epick_points& points, std::vector<std::vector<size_t>>& faces) {
  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulator;
  for (const auto& polygon : polygons) {
    std::vector<Polygon_2> triangles;
    triangulator(polygon, std::back_inserter(triangles));
    for (const Polygon_2& triangle : triangles) {
      size_t index = points.size();
      faces.push_back({index, index + 1, index + 2});
      points.push_back(to_epick(plane.to_3d(triangle[0])));
      points.push_back(to_epick(plane.to_3d(triangle[1])));
      points.push_back(to_epick(plane.to_3d(triangle[2])));
    }
  }
}

void wrap_add_segments_epeck(const Segments& segments, Points& points,
                             std::vector<std::vector<size_t>>& faces) {
  const double kIota = 0.0001;
  for (Segment s3 : segments) {
    size_t index = points.size();
    const Point& s = s3.source();
    const Point& t = s3.target();
    points.push_back(s);
    points.push_back(t);
    points.push_back(Point(s.x() + kIota, s.y() + kIota, s.z() + kIota));
    faces.push_back({index, index + 1, index + 2});
  }
}

void wrap_add_segments_epick(
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_epick,
    const Segments& segments, Epick_points& points,
    std::vector<std::vector<size_t>>& faces) {
  const double kIota = 0.0001;
  for (Segment s3 : segments) {
    size_t index = points.size();
    const Epick_point& s = to_epick(s3.source());
    const Epick_point& t = to_epick(s3.target());
    points.push_back(s);
    points.push_back(t);
    points.push_back(Epick_point(s.x() + kIota, s.y() + kIota, s.z() + kIota));
    faces.push_back({index, index + 1, index + 2});
  }
}

void wrap_add_points_epeck(const Points& input_points, Points& output_points) {
  output_points = input_points;
}

void wrap_add_points_epick(
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_epick,
    const Points& input_points, Epick_points& output_points) {
  for (Point p3 : input_points) {
    output_points.push_back(to_epick(p3));
  }
}

void wrap_epick(const Epick_points& points,
                const std::vector<std::vector<size_t>>& faces, double alpha,
                double offset, Surface_mesh& output_mesh) {
  Epick_surface_mesh epick_mesh;
  if (faces.empty()) {
    alpha_wrap_3(points, alpha, offset, epick_mesh);
  } else {
    alpha_wrap_3(points, faces, alpha, offset, epick_mesh);
  }
  copy_face_graph(epick_mesh, output_mesh);
}
