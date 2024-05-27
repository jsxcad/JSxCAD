#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Kernel_traits.h>
#include <CGAL/Polygon_mesh_processing/transform.h>

#include "convert.h"
#include "point_util.h"

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;
typedef CGAL::Exact_predicates_inexact_constructions_kernel IK;

static FT compute_scaling_factor(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value * 0.999, value * 1.001);
}

static FT compute_translation_offset(double value) {
  return CGAL::simplest_rational_in_interval<FT>(value - 0.001, value + 0.001);
}

template <typename RT>
static void compute_turn(double turn, RT& sin_alpha, RT& cos_alpha, RT& w) {
  // Convert angle to radians.
  double radians = turn * 2 * CGAL_PI;
  CGAL::rational_rotation_approximation(radians, sin_alpha, cos_alpha, w, RT(1),
                                        RT(1000));
}

template <typename Vector>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Vector>::Kernel>
rotate_x_to_y0(const Vector& direction) {
  typedef typename CGAL::Kernel_traits<Vector>::Kernel K;
  typedef CGAL::Aff_transformation_3<K> Transformation;
  typename K::FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.z(), direction.y(), sin_alpha,
                                        cos_alpha, w, typename K::RT(1),
                                        typename K::RT(1000));
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

template <typename Vector>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Vector>::Kernel>
rotate_y_to_x0(const Vector& direction) {
  typedef typename CGAL::Kernel_traits<Vector>::Kernel K;
  typedef CGAL::Aff_transformation_3<K> Transformation;
  typename K::FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.z(), direction.x(), sin_alpha,
                                        cos_alpha, w, typename K::RT(1),
                                        typename K::RT(1000));
  return Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha, 0,
                        cos_alpha, 0, w);
}

template <typename Vector>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Vector>::Kernel>
rotate_z_to_y0(const Vector& direction) {
  typedef typename CGAL::Kernel_traits<Vector>::Kernel K;
  typedef CGAL::Aff_transformation_3<K> Transformation;
  typename K::FT sin_alpha, cos_alpha, w;
  CGAL::rational_rotation_approximation(direction.x(), direction.y(), sin_alpha,
                                        cos_alpha, w, typename K::RT(1),
                                        typename K::RT(1000));
  return Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha, 0, 0,
                        0, 0, w, 0, w);
}

template <typename Vector>
static void disorient_along_z(
    Vector source, Vector normal,
    CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Vector>::Kernel>&
        align) {
  if (source.y() != 0 || source.z() != 0) {
    auto rotation = rotate_x_to_y0(source);
    source = source.transform(rotation);
    align = rotation * align;
  }

  if (source.x() != 0 || source.z() != 0) {
    auto rotation = rotate_y_to_x0(source);
    source = source.transform(rotation);
    align = rotation * align;
  }

  auto transformedNormal = normal.transform(align);

  if (transformedNormal.x() != 0 || transformedNormal.y() != 0) {
    auto rotation = rotate_z_to_y0(transformedNormal);
    align = rotation * align;
  }
}

template <typename Vector>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Vector>::Kernel>
translate(const Vector& vector) {
  return CGAL::Aff_transformation_3<
      typename CGAL::Kernel_traits<Vector>::Kernel>(CGAL::TRANSLATION, vector);
}

template <typename Point>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Point>::Kernel>
translate_to(const Point& point) {
  return CGAL::Aff_transformation_3<
      typename CGAL::Kernel_traits<Point>::Kernel>(CGAL::TRANSLATION,
                                                   point - Point(0, 0, 0));
}

template <typename Plane>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Plane>::Kernel>
disorient_plane_along_z(Plane source) {
  CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Plane>::Kernel>
      transform(CGAL::IDENTITY);
  disorient_along_z(unitVector(source.orthogonal_vector()),
                    unitVector(source.base1()), transform);
  Point s = source.to_3d(Point_2(0, 0));
  transform = transform * translate(Point(0, 0, 0) - s);
  return transform;
}

template <typename Transformation>
static void Transformation__to_exact(const Transformation& t,
                                     std::string& exact) {
  std::ostringstream serialization;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      auto value = t.cartesian(i, j).exact();
      serialization << value << " ";
    }
  }
  auto value = t.cartesian(3, 3).exact();
  serialization << value;
  exact = std::move(serialization.str());
}

template <typename Transformation>
static std::string to_exact(const Transformation& t) {
  std::string s;
  Transformation__to_exact(t, s);
  return s;
}

template <typename Point>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Point>::Kernel>
computeInverseSegmentTransform(
    const Point& start, const Point& end,
    const typename CGAL::Kernel_traits<Point>::Kernel::Vector_3& normal) {
  Point zero(0, 0, 0);
  CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Point>::Kernel> align(
      CGAL::IDENTITY);
  disorient_along_z(end - start, normal, align);
  return CGAL::Aff_transformation_3<
      typename CGAL::Kernel_traits<Point>::Kernel>(align *
                                                   translate(zero - start));
}

template <typename Transformation>
static void to_doubles(const Transformation& t, double doubles[16]) {
  doubles[0] = to_double(t.cartesian(0, 0));
  doubles[1] = to_double(t.cartesian(1, 0));
  doubles[2] = to_double(t.cartesian(2, 0));
  doubles[3] = 0;
  doubles[4] = to_double(t.cartesian(0, 1));
  doubles[5] = to_double(t.cartesian(1, 1));
  doubles[6] = to_double(t.cartesian(2, 1));
  doubles[7] = 0;
  doubles[8] = to_double(t.cartesian(0, 2));
  doubles[9] = to_double(t.cartesian(1, 2));
  doubles[10] = to_double(t.cartesian(2, 2));
  doubles[11] = 0;
  doubles[12] = to_double(t.cartesian(0, 3));
  doubles[13] = to_double(t.cartesian(1, 3));
  doubles[14] = to_double(t.cartesian(2, 3));
  doubles[15] = 1;
}

static EK::Aff_transformation_3 to_transform(std::istringstream& s) {
  FT v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13;
  s >> v1;
  s >> v2;
  s >> v3;
  s >> v4;
  s >> v5;
  s >> v6;
  s >> v7;
  s >> v8;
  s >> v9;
  s >> v10;
  s >> v11;
  s >> v12;
  s >> v13;
  return EK::Aff_transformation_3(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11,
                                  v12, v13);
}

static EK::Aff_transformation_3 to_transform(const std::string& data) {
  std::istringstream s(data);
  return to_transform(s);
}

static EK::Aff_transformation_3 to_transform(double v1, double v2, double v3,
                                             double v4, double v5, double v6,
                                             double v7, double v8, double v9,
                                             double v10, double v11, double v12,
                                             double v13) {
  return EK::Aff_transformation_3(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4),
                                  to_FT(v5), to_FT(v6), to_FT(v7), to_FT(v8),
                                  to_FT(v9), to_FT(v10), to_FT(v11), to_FT(v12),
                                  to_FT(v13));
}

static EK::Aff_transformation_3 TranslateTransform(double x, double y,
                                                   double z) {
  return EK::Aff_transformation_3(
      CGAL::TRANSLATION,
      EK::Vector_3(compute_translation_offset(x), compute_translation_offset(y),
                   compute_translation_offset(z)));
}

static EK::Aff_transformation_3 ScaleTransform(double x, double y, double z) {
  return EK::Aff_transformation_3(compute_scaling_factor(x), 0, 0, 0, 0,
                                  compute_scaling_factor(y), 0, 0, 0, 0,
                                  compute_scaling_factor(z), 0, 1);
}

template <typename Transformation, typename RT>
static Transformation TransformationFromXTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

template <typename Transformation, typename RT>
static Transformation TransformationFromYTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha, 0,
                        cos_alpha, 0, w);
}

template <typename Transformation, typename RT>
static Transformation TransformationFromZTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha, 0, 0,
                        0, 0, w, 0, w);
}

template <typename K>
static CGAL::Aff_transformation_3<K> zturn(double turn) {
  typename K::RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return CGAL::Aff_transformation_3<K>(cos_alpha, sin_alpha, 0, 0, -sin_alpha,
                                       cos_alpha, 0, 0, 0, 0, w, 0, w);
}

template <typename K>
static CGAL::Aff_transformation_2<K> zturn2(double turn) {
  typename K::RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return CGAL::Aff_transformation_2<K>(cos_alpha, -sin_alpha, 0, sin_alpha,
                                       cos_alpha, 0, w);
}

// Why does this exist?
template <typename Point>
static CGAL::Aff_transformation_3<typename CGAL::Kernel_traits<Point>::Kernel>
InverseSegmentTransform(
    const Point& start, const Point& end,
    const typename CGAL::Kernel_traits<Point>::Kernel::Vector_3& normal) {
  return computeInverseSegmentTransform(start, end, normal);
}

static void transformPolygonWithHoles(
    typename CGAL::Polygon_with_holes_2<EK>& polygon,
    const EK::Plane_3& input_plane, const EK::Plane_3& output_plane,
    const CGAL::Aff_transformation_3<EK>& transform) {
  typedef CGAL::Polygon_2<EK> Polygon_2;
  typedef EK::Point_3 Point;
  typedef EK::Point_2 Point_2;
  Polygon_2 output_boundary;
  for (const Point_2& input_p2 : polygon.outer_boundary()) {
    Point p3 = input_plane.to_3d(input_p2).transform(transform);
    if (!output_plane.has_on(p3)) {
      std::cout << "QQ/transformPolygonWithHoles/offplane: point " << p3
                << " plane " << output_plane << std::endl;
    }
    Point_2 output_p2 = output_plane.to_2d(p3);
    output_boundary.push_back(output_p2);
  }
  std::vector<Polygon_2> output_holes;
  for (const auto& hole : polygon.holes()) {
    Polygon_2 output_hole;
    for (const Point_2& p2 : hole) {
      Point p3 = input_plane.to_3d(p2).transform(transform);
      if (!output_plane.has_on(p3)) {
        std::cout << "QQ/transformPolygonWithHoles/offplane: point " << p3
                  << " plane " << output_plane << std::endl;
      }
      output_hole.push_back(output_plane.to_2d(p3));
    }
    output_holes.push_back(std::move(output_hole));
  }
  polygon = Polygon_with_holes_2(output_boundary, output_holes.begin(),
                                 output_holes.end());
}

static void transformPolygonsWithHoles(
    std::vector<CGAL::Polygon_with_holes_2<EK>>& polygons,
    const EK::Plane_3& input_plane, const EK::Plane_3& output_plane,
    const CGAL::Aff_transformation_3<EK>& transform) {
  for (Polygon_with_holes_2& polygon : polygons) {
    transformPolygonWithHoles(polygon, input_plane, output_plane, transform);
  }
}

template <typename Segment, typename Transformation>
static void transformSegments(std::vector<Segment>& segments,
                              const Transformation& transform) {
  for (Segment& segment : segments) {
    segment = segment.transform(transform);
  }
}

template <typename Edge, typename Transformation>
static void transformEdge(Edge& edge, const Transformation& transform) {
  edge = Edge(edge.segment.transform(transform),
              edge.normal.transform(transform), edge.face_id);
}

template <typename Edge, typename Transformation>
static void transformEdges(std::vector<Edge>& edges,
                           const Transformation& transform) {
  for (Edge& edge : edges) {
    transformEdge(edge, transform);
  }
}

template <typename Point, typename Transformation>
static void transformPoints(std::vector<Point>& points,
                            const Transformation& transform) {
  for (Point& point : points) {
    point = point.transform(transform);
  }
}
