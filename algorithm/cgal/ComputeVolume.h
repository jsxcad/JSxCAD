double ComputeVolume(Geometry* geometry) {
  FT volume = 0;
  int size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        volume += CGAL::Polygon_mesh_processing::volume(
            geometry->mesh(nth), CGAL::parameters::all_default());
        break;
      }
    }
  }
  return CGAL::to_double(volume);
}
