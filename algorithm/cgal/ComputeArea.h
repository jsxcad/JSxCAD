double ComputeArea(Geometry* geometry) {
  FT area = 0;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        area += CGAL::Polygon_mesh_processing::area(
            geometry->mesh(nth), CGAL::parameters::all_default());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        for (const Polygon_with_holes_2& pwh : geometry->pwh(nth)) {
          area += pwh.outer_boundary().area();
          for (const Polygon_2& hole : pwh.holes()) {
            area += hole.area();
          }
        }
      }
    }
  }
  return CGAL::to_double(area);
}
