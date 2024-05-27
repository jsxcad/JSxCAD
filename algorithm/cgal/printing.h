#pragma once

#include <CGAL/Exact_predicates_exact_constructions_kernel.h>

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

std::ostream& operator<<(std::ostream& os, const EK::Point_2& p) {
  // os << "[" << p.x().exact() << ", " << p.y().exact() << "]";
  os << "[" << p.x() << ", " << p.y() << "]";
  return os;
}

std::ostream& operator<<(std::ostream& os, const CGAL::Polygon_2<EK>& polygon) {
  for (const auto& p : polygon) {
    os << p << ",";
  }
  return os;
}

std::ostream& operator<<(std::ostream& os,
                         const CGAL::Polygon_with_holes_2<EK>& pwh) {
  os << "p=" << pwh.outer_boundary();
  for (const auto& hole : pwh.holes()) {
    os << " h=" << hole;
  }
  return os;
}

template <class Kernel, class Container>
static std::ostream& operator<<(
    std::ostream& os,
    const std::vector<CGAL::Polygon_with_holes_2<Kernel, Container>>& pwhs) {
  os << std::endl;
  for (const auto& pwh : pwhs) {
    os << "  " << pwh << std::endl;
  }
  return os;
}

static std::ostream& operator<<(std::ostream& os,
                                const std::vector<EK::Point_2>& points) {
  for (const auto& point : points) {
    os << "  " << point;
  }
  return os;
}

template <class Kernel, class Container>
static void print_polygon(const CGAL::Polygon_2<Kernel, Container>& P) {
  typename CGAL::Polygon_2<Kernel, Container>::Vertex_const_iterator vit;
  std::cout << std::setprecision(20);
  for (vit = P.vertices_begin(); vit != P.vertices_end(); ++vit) {
    if (vit != P.vertices_begin()) {
      std::cout << ", ";
    }
    // std::cout << "{ to_FT(\"" << vit->x().exact() << "\"), to_FT(\""
    // << vit->y().exact() << "\")}";
    std::cout << "[" << vit->x().exact() << ", " << vit->y().exact() << "]";
  }
}

template <class Kernel, class Container>
static void print_polygon_nl(const CGAL::Polygon_2<Kernel, Container>& P) {
  print_polygon(P);
  std::cout << std::endl;
}

template <class Kernel, class Container>
static void print_polygons(
    const std::vector<CGAL::Polygon_2<Kernel, Container>>& Ps) {
  for (const auto& P : Ps) {
    print_polygon(P);
  }
}

template <class Kernel, class Container>
static void print_polygons_nl(
    std::vector<CGAL::Polygon_2<Kernel, Container>>& P) {
  print_polygons(P);
  std::cout << std::endl;
}

template <class Kernel, class Container>
static void print_polygon_with_holes(
    const CGAL::Polygon_with_holes_2<Kernel, Container>& pwh) {
  if (!pwh.is_unbounded()) {
    std::cout << "Polygon: ";
    print_polygon_nl(pwh.outer_boundary());
  } else {
    std::cout << "Unbounded polygon." << std::endl;
  }
  typename CGAL::Polygon_with_holes_2<Kernel, Container>::Hole_const_iterator
      hit;
  unsigned int k = 1;
  std::cout << " " << pwh.number_of_holes() << " holes:" << std::endl;
  for (hit = pwh.holes_begin(); hit != pwh.holes_end(); ++hit, ++k) {
    std::cout << "Hole: ";
    print_polygon_nl(*hit);
  }
  std::cout << std::endl;
}

template <class Kernel, class Container>
static void print_polygons_with_holes(
    const std::vector<CGAL::Polygon_with_holes_2<Kernel, Container>>& pwhs) {
  for (const auto& pwh : pwhs) {
    print_polygon_with_holes(pwh);
  }
}
