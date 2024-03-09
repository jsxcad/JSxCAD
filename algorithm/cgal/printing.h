#pragma once

template <class Kernel, class Container>
static void print_polygon(const CGAL::Polygon_2<Kernel, Container>& P) {
  typename CGAL::Polygon_2<Kernel, Container>::Vertex_const_iterator vit;
  std::cout << std::setprecision(20) << "Polygon(";
  for (vit = P.vertices_begin(); vit != P.vertices_end(); ++vit) {
    if (vit != P.vertices_begin()) {
      std::cout << ", ";
    }
    std::cout << "{ to_FT(\"" << vit->x().exact() << "\"), to_FT(\""
              << vit->y().exact() << "\")}";
    // std::cout << "Point(" << vit->x() << ", " << vit->y() << ")";
  }
  std::cout << ")";
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
