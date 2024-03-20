static int ComputeNormal(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPlanarMeshesToPolygons();
  for (size_t nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Vector normal;
        computeNormalOfSurfaceMesh(normal, geometry->mesh(nth));
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, Point(0, 0, 0));
        geometry->setTransform(nth, translate(normal).inverse());
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Vector normal = geometry->plane(nth).orthogonal_vector();
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, Point(0, 0, 0));
        geometry->setTransform(nth, translate(normal));
        break;
      }
    }
  }
  return STATUS_OK;
}
