int ConvertPolygonsToMeshes(Geometry* geometry) {
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  geometry->transformToLocalFrame();

  return STATUS_OK;
}
