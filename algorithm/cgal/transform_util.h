#pragma once

#include "Edge.h"

static std::shared_ptr<const Transformation> Transformation__identity() {
  return std::shared_ptr<const Transformation>(
      new Transformation(CGAL::IDENTITY));
}

static std::shared_ptr<const Transformation> Transformation__compose(
    std::shared_ptr<const Transformation> a,
    std::shared_ptr<const Transformation> b) {
  return std::shared_ptr<const Transformation>(new Transformation(*a * *b));
}

static std::shared_ptr<const Transformation> Transformation__inverse(
    std::shared_ptr<const Transformation> a) {
  return std::shared_ptr<const Transformation>(
      new Transformation(a->inverse()));
}

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

static std::string to_exact(const Transformation& t) {
  std::string s;
  Transformation__to_exact(t, s);
  return s;
}

static void Transformation__to_exact(
    std::shared_ptr<const Transformation> t,
    const std::function<void(const std::string& str)>& put) {
  std::string exact;
  Transformation__to_exact(*t, exact);
  put(exact);
}

static void Transformation__to_approximate(
    std::shared_ptr<const Transformation> t, emscripten::val put) {
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      FT value = t->cartesian(i, j);
      put(CGAL::to_double(value.exact()));
    }
  }

  FT value = t->cartesian(3, 3);
  put(CGAL::to_double(value.exact()));
}

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

static Transformation to_transform(std::istringstream& s) {
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
  return Transformation(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13);
}

static Transformation to_transform(const std::string& data) {
  std::istringstream s(data);
  return to_transform(s);
}

static std::shared_ptr<const Transformation> Transformation__from_exact(
    const std::string& v1, const std::string& v2, const std::string& v3,
    const std::string& v4, const std::string& v5, const std::string& v6,
    const std::string& v7, const std::string& v8, const std::string& v9,
    const std::string& v10, const std::string& v11, const std::string& v12,
    const std::string& v13) {
  return std::shared_ptr<const Transformation>(
      new Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                         to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                         to_FT(v11), to_FT(v12), to_FT(v13)));
}

static Transformation to_transform(double v1, double v2, double v3, double v4,
                                   double v5, double v6, double v7, double v8,
                                   double v9, double v10, double v11,
                                   double v12, double v13) {
  return Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                        to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                        to_FT(v11), to_FT(v12), to_FT(v13));
}

static std::shared_ptr<const Transformation> Transformation__from_approximate(
    double v1, double v2, double v3, double v4, double v5, double v6, double v7,
    double v8, double v9, double v10, double v11, double v12, double v13) {
  return std::shared_ptr<const Transformation>(
      new Transformation(to_FT(v1), to_FT(v2), to_FT(v3), to_FT(v4), to_FT(v5),
                         to_FT(v6), to_FT(v7), to_FT(v8), to_FT(v9), to_FT(v10),
                         to_FT(v11), to_FT(v12), to_FT(v13)));
}

static Transformation TranslateTransform(double x, double y, double z) {
  return Transformation(
      CGAL::TRANSLATION,
      Vector(compute_translation_offset(x), compute_translation_offset(y),
             compute_translation_offset(z)));
}

static std::shared_ptr<const Transformation> Transformation__translate(
    double x, double y, double z) {
  return std::shared_ptr<const Transformation>(
      new Transformation(TranslateTransform(x, y, z)));
}

static Transformation ScaleTransform(double x, double y, double z) {
  return Transformation(compute_scaling_factor(x), 0, 0, 0, 0,
                        compute_scaling_factor(y), 0, 0, 0, 0,
                        compute_scaling_factor(z), 0, 1);
}

static std::shared_ptr<const Transformation> Transformation__scale(double x,
                                                                   double y,
                                                                   double z) {
  return std::shared_ptr<const Transformation>(
      new Transformation(ScaleTransform(x, y, z)));
}

template <typename Transformation, typename RT>
static Transformation TransformationFromXTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(w, 0, 0, 0, 0, cos_alpha, -sin_alpha, 0, 0, sin_alpha,
                        cos_alpha, 0, w);
}

template <typename Transformation, typename RT>
static std::shared_ptr<const Transformation> Transformation__rotate_x(
    double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return std::shared_ptr<const Transformation>(
      new Transformation(TransformationFromXTurn<Transformation, RT>(a)));
}

template <typename Transformation, typename RT>
static Transformation TransformationFromYTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(cos_alpha, 0, -sin_alpha, 0, 0, w, 0, 0, sin_alpha, 0,
                        cos_alpha, 0, w);
}

template <typename Transformation, typename RT>
static std::shared_ptr<const Transformation> Transformation__rotate_y(
    double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return std::shared_ptr<const Transformation>(
      new Transformation(TransformationFromYTurn<Transformation, RT>(a)));
}

template <typename Transformation, typename RT>
static Transformation TransformationFromZTurn(double turn) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(turn, sin_alpha, cos_alpha, w);
  return Transformation(cos_alpha, sin_alpha, 0, 0, -sin_alpha, cos_alpha, 0, 0,
                        0, 0, w, 0, w);
}

template <typename Transformation, typename RT>
static std::shared_ptr<const Transformation> Transformation__rotate_z(
    double a) {
  RT sin_alpha, cos_alpha, w;
  compute_turn(a, sin_alpha, cos_alpha, w);
  return std::shared_ptr<const Transformation>(
      new Transformation(TransformationFromZTurn<Transformation, RT>(a)));
}

static std::shared_ptr<const Transformation> Transformation__rotate_x_to_y0(
    double x, double y, double z) {
  Transformation transform = rotate_x_to_y0(Vector(x, y, z));
  return std::shared_ptr<const Transformation>(new Transformation(transform));
}

static std::shared_ptr<const Transformation> Transformation__rotate_y_to_x0(
    double x, double y, double z) {
  Transformation transform = rotate_y_to_x0(Vector(x, y, z));
  return std::shared_ptr<const Transformation>(new Transformation(transform));
}

static std::shared_ptr<const Transformation> Transformation__rotate_z_to_y0(
    double x, double y, double z) {
  Transformation transform = rotate_z_to_y0(Vector(x, y, z));
  return std::shared_ptr<const Transformation>(new Transformation(transform));
}

static Transformation InverseSegmentTransform(const Point& start,
                                              const Point& end,
                                              const Vector& normal) {
  return Transformation(computeInverseSegmentTransform(start, end, normal));
}

static std::shared_ptr<const Transformation> InverseSegmentTransform(
    double startX, double startY, double startZ, double endX, double endY,
    double endZ, double normalX, double normalY, double normalZ) {
  return std::shared_ptr<const Transformation>(
      new Transformation(InverseSegmentTransform(
          Point(startX, startY, startZ), Point(endX, endY, endZ),
          Vector(normalX, normalY, normalZ))));
}

static void transformPolygonWithHoles(Polygon_with_holes_2& polygon,
                                      const Plane& input_plane,
                                      const Plane& output_plane,
                                      const Transformation& transform) {
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

static void transformPolygonsWithHoles(Polygons_with_holes_2& polygons,
                                       const Plane& input_plane,
                                       const Plane& output_plane,
                                       const Transformation& transform) {
  for (Polygon_with_holes_2& polygon : polygons) {
    transformPolygonWithHoles(polygon, input_plane, output_plane, transform);
  }
}

static void transformSegments(Segments& segments,
                              const Transformation& transform) {
  for (Segment& segment : segments) {
    segment = segment.transform(transform);
  }
}

static void transformEdge(Edge& edge, const Transformation& transform) {
  edge = Edge(edge.segment.transform(transform),
              edge.normal.transform(transform), edge.face_id);
}

static void transformEdges(Edges& edges, const Transformation& transform) {
  for (Edge& edge : edges) {
    transformEdge(edge, transform);
  }
}

static void transformPoints(Points& points, const Transformation& transform) {
  for (Point& point : points) {
    point = point.transform(transform);
  }
}
