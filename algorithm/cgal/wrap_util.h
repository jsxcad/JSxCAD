#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_triangulation_decomposition_2.h>
#include <CGAL/Polygon_with_holes_2.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/alpha_wrap_3.h>

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;

static void wrap_compute_alpha_and_offset(const CGAL::Bbox_3& bbox,
                                          double relative_alpha,
                                          double relative_offset, double& alpha,
                                          double& offset) {
  const double diag_length = std::sqrt(CGAL::square(bbox.xmax() - bbox.xmin()) +
                                       CGAL::square(bbox.ymax() - bbox.ymin()) +
                                       CGAL::square(bbox.zmax() - bbox.zmin()));
  alpha = diag_length / relative_alpha;
  offset = diag_length / relative_offset;
}

static void wrap_add_mesh_epick(CGAL::Cartesian_converter<EK, IK>& to_epick,
                                const CGAL::Surface_mesh<EK::Point_3>& mesh,
                                std::vector<IK::Point_3>& points,
                                std::vector<std::vector<size_t>>& faces) {
  typedef CGAL::Surface_mesh<EK::Point_3> Surface_mesh;
  for (const Surface_mesh::Face_index face : mesh.faces()) {
    Surface_mesh::Halfedge_index a = mesh.halfedge(face);
    Surface_mesh::Halfedge_index b = mesh.next(a);
    Surface_mesh::Halfedge_index c = mesh.next(b);
    size_t index = points.size();
    faces.push_back({index, index + 1, index + 2});
    points.push_back(to_epick(mesh.point(mesh.source(a))));
    points.push_back(to_epick(mesh.point(mesh.source(b))));
    points.push_back(to_epick(mesh.point(mesh.source(c))));
  }
}

static void wrap_add_polygons_with_holes_2_epick(
    CGAL::Cartesian_converter<EK, IK>& to_epick,
    const std::vector<CGAL::Polygon_with_holes_2<EK>>& polygons,
    const EK::Plane_3& plane, std::vector<IK::Point_3>& points,
    std::vector<std::vector<size_t>>& faces) {
  CGAL::Polygon_triangulation_decomposition_2<EK> triangulator;
  for (const auto& polygon : polygons) {
    std::vector<CGAL::Polygon_2<EK>> triangles;
    triangulator(polygon, std::back_inserter(triangles));
    for (const CGAL::Polygon_2<EK>& triangle : triangles) {
      size_t index = points.size();
      faces.push_back({index, index + 1, index + 2});
      points.push_back(to_epick(plane.to_3d(triangle[0])));
      points.push_back(to_epick(plane.to_3d(triangle[1])));
      points.push_back(to_epick(plane.to_3d(triangle[2])));
    }
  }
}

static void wrap_add_segments_epick(CGAL::Cartesian_converter<EK, IK>& to_epick,
                                    const std::vector<EK::Segment_3>& segments,
                                    std::vector<IK::Point_3>& points,
                                    std::vector<std::vector<size_t>>& faces) {
  const double kIota = 0.0001;
  for (EK::Segment_3 s3 : segments) {
    size_t index = points.size();
    const IK::Point_3& s = to_epick(s3.source());
    const IK::Point_3& t = to_epick(s3.target());
    points.push_back(s);
    points.push_back(t);
    points.push_back(IK::Point_3(s.x() + kIota, s.y() + kIota, s.z() + kIota));
    faces.push_back({index, index + 1, index + 2});
  }
}

static void wrap_add_points_epick(CGAL::Cartesian_converter<EK, IK>& to_epick,
                                  const std::vector<EK::Point_3>& input_points,
                                  std::vector<IK::Point_3>& output_points) {
  for (EK::Point_3 p3 : input_points) {
    output_points.push_back(to_epick(p3));
  }
}

static void wrap_epick(const std::vector<IK::Point_3>& points,
                       const std::vector<std::vector<size_t>>& faces,
                       double alpha, double offset, CGAL::Surface_mesh<EK::Point_3>& output_mesh) {
  CGAL::Surface_mesh<IK::Point_3> epick_mesh;
  if (faces.empty()) {
    alpha_wrap_3(points, alpha, offset, epick_mesh);
  } else {
    alpha_wrap_3(points, faces, alpha, offset, epick_mesh);
  }
  copy_face_graph(epick_mesh, output_mesh);
}
