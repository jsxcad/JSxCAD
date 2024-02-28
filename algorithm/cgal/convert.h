#pragma once

void write_point(const Point& p, std::ostringstream& o) {
  o << p.x().exact() << " ";
  o << p.y().exact() << " ";
  o << p.z().exact();
}

// Approximations are in 100ths of a mm.
void write_approximate_point(const Point& p, std::ostringstream& o) {
  o << round(CGAL::to_double(p.x().exact()) * 1000) << " ";
  o << round(CGAL::to_double(p.y().exact()) * 1000) << " ";
  o << round(CGAL::to_double(p.z().exact()) * 1000);
}

void read_point(Point& point, std::istringstream& input) {
  FT x, y, z;
  input >> x;
  input >> y;
  input >> z;
  point = Point(x, y, z);
}

void read_point_approximate(Point& point, std::istringstream& input) {
  double x, y, z;
  input >> x;
  input >> y;
  input >> z;
  point = Point(x, y, z);
}

void read_segment(Segment& segment, std::istringstream& input) {
  Point source;
  read_point(source, input);
  Point target;
  read_point(target, input);
  segment = Segment(source, target);
}

void write_segment(Segment s, std::ostringstream& o) {
  write_point(s.source(), o);
  o << " ";
  write_point(s.target(), o);
}

template <typename emit>
void emitPoint(Point p, const emit& emit_point) {
  std::ostringstream exact;
  write_point(p, exact);
  emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()),
             CGAL::to_double(p.z().exact()), exact.str());
}

void emitPoint2(Point_2 p, emscripten::val emit_point) {
  std::ostringstream x;
  x << p.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << p.y().exact();
  std::string ys = y.str();
  emit_point(CGAL::to_double(p.x().exact()), CGAL::to_double(p.y().exact()), xs,
             ys);
}

void emitNthPoint(int nth, Point p, emscripten::val emit_point) {
  std::ostringstream x;
  x << p.x().exact();
  std::string xs = x.str();
  std::ostringstream y;
  y << p.y().exact();
  std::string ys = y.str();
  std::ostringstream z;
  z << p.z().exact();
  std::string zs = z.str();
  emit_point(nth, CGAL::to_double(p.x().exact()),
             CGAL::to_double(p.y().exact()), CGAL::to_double(p.z().exact()), xs,
             ys, zs);
}
