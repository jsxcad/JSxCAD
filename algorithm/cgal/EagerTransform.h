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
        CGAL::Polygon_mesh_processing::transform(
            transform, geometry->mesh(nth), CGAL::parameters::all_default());
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
