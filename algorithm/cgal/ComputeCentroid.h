static int ComputeCentroid(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        Point centroid;
        computeCentroidOfSurfaceMesh(centroid, geometry->mesh(nth));
        geometry->setType(nth, GEOMETRY_POINTS);
        geometry->addPoint(nth, centroid);
        geometry->setIdentityTransform(nth);
        break;
      }
    }
  }
  return STATUS_OK;
}
