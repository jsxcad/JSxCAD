template <typename FT, typename Point>
FT unitSphereFunction(Point p) {
  const FT x2 = p.x() * p.x(), y2 = p.y() * p.y(), z2 = p.z() * p.z();
  return x2 + y2 + z2 - 1;
}

int MakeAbsolute(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  for (int nth = 0; nth < size; nth++) {
    geometry->setIdentityTransform(nth);
  }

  // The local frame is the absolute frame.
  geometry->set_local_frame();

  return STATUS_OK;
}
