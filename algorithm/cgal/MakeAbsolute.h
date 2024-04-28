#include "Geometry.h"

static int MakeAbsolute(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->copyInputSegmentsToOutputSegments();
  geometry->copyInputPointsToOutputPoints();
  geometry->transformToAbsoluteFrame();

  for (size_t nth = 0; nth < size; nth++) {
    geometry->setIdentityTransform(nth);
  }

  // The local frame is the absolute frame.
  geometry->set_local_frame();

  return STATUS_OK;
}
