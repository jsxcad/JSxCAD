int EagerTransform(Geometry* geometry, int count) {
  size_t size = geometry->size();

  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  const Transformation& transform = geometry->transform(count);

  for (int nth = 0; nth < count; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_MESH: {
        // Ideally we would:
        //  auto r = transformGeometryOfOcctShape(transform, geometry->occt_shape(nth));
        //  geometry->setOcctShape(nth, r);
        //  geometry->discard_mesh(nth);
        // but transformGeometryOfOcctShape is not working reliably.
        // So for now we drop down to the cgal mesh representation where we need a general transform
        // (such as non-uniform scaling).
        if (geometry->has_occt_shape(nth) || geometry->has_mesh(nth)) {
          // geometry->mesh(nth) will convert the occt_shape, if necessary.
          CGAL::Polygon_mesh_processing::transform(
              transform, geometry->mesh(nth), CGAL::parameters::all_default());
        }
#ifdef ENABLE_OCCT
        if (geometry->has_occt_shape(nth)) {
          // Any occt shape we have is now invalid.
          geometry->discard_occt_shape(nth);
        }
#endif
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        Plane transformed_plane =
            unitPlane(geometry->plane(nth).transform(transform));
        transformPolygonsWithHoles(geometry->pwh(nth), geometry->plane(nth),
                                   transformed_plane, transform);
        geometry->plane(nth) = transformed_plane;
        break;
      }
      case GEOMETRY_POINTS: {
        transformPoints(geometry->points(nth), transform);
        break;
      }
      case GEOMETRY_SEGMENTS: {
        transformSegments(geometry->segments(nth), transform);
        break;
      }
      case GEOMETRY_EDGES: {
        transformEdges(geometry->edges(nth), transform);
        break;
      }
      case GEOMETRY_REFERENCE: {
        geometry->copyTransform(nth, transform * geometry->transform(nth));
        break;
      }
    }
  }

  geometry->transformToLocalFrame();

  return STATUS_OK;
}
