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
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_cartesian,
    const Surface_mesh& mesh, Epick_points& points,
    std::vector<std::vector<size_t>>& faces) {
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
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_cartesian,
    const Polygons_with_holes_2& polygons, const Plane& plane,
    Epick_points& points, std::vector<std::vector<size_t>>& faces) {
  CGAL::Polygon_triangulation_decomposition_2<Kernel> triangulator;
  for (const auto& polygon : polygons) {
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
}

void wrap_add_segments_epeck(const Segments& segments, Points& points) {
  for (Segment s3 : segments) {
    points.push_back(s3.source());
    points.push_back(s3.target());
  }
}

void wrap_add_segments_epick(
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_cartesian,
    const Segments& segments, Epick_points& points) {
  for (Segment s3 : segments) {
    points.push_back(to_cartesian(s3.source()));
    points.push_back(to_cartesian(s3.target()));
  }
}

void wrap_add_points_epeck(const Points& input_points, Points& output_points) {
  output_points = input_points;
}

void wrap_add_points_epick(
    CGAL::Cartesian_converter<Kernel, Epick_kernel>& to_cartesian,
    const Points& input_points, Epick_points& output_points) {
  for (Point p3 : input_points) {
    output_points.push_back(to_cartesian(p3));
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
