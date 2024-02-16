#include "outline_util.h"

int Outline(Geometry* geometry) {
  int size = geometry->size();

  geometry->copyInputSegmentsToOutputSegments();

  for (int nth = 0; nth < size; nth++) {
    switch (geometry->getType(nth)) {
      case GEOMETRY_SEGMENTS: {
        break;
      }
      case GEOMETRY_POLYGONS_WITH_HOLES: {
        const Plane& plane = geometry->plane(nth);
        geometry->setType(nth, GEOMETRY_SEGMENTS);
        outlinePolygonsWithHoles(geometry->pwh(nth), plane,
                                 geometry->segments(nth));
        break;
      }
      case GEOMETRY_MESH: {
        geometry->setType(nth, GEOMETRY_SEGMENTS);
        outlineSurfaceMesh(geometry->input_mesh(nth), geometry->segments(nth));
        break;
      }
      default: {
        geometry->setType(nth, GEOMETRY_EMPTY);
        break;
      }
    }
  }

  return STATUS_OK;
}
