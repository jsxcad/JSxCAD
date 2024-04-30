#include <CGAL/Exact_predicates_exact_constructions_kernel.h>
#include <CGAL/centroid.h>

typedef CGAL::Exact_predicates_exact_constructions_kernel EK;

static void computeCentroidOfSurfaceMesh(Point& centroid,
                                         const Surface_mesh& mesh) {
  std::vector<EK::Triangle_3> triangles;
  for (const auto& facet : mesh.faces()) {
    if (mesh.is_removed(facet)) {
      continue;
    }
    const auto h = mesh.halfedge(facet);
    triangles.push_back(EK::Triangle_3(
        mesh.point(mesh.source(h)), mesh.point(mesh.source(mesh.next(h))),
        mesh.point(mesh.source(mesh.next(mesh.next(h))))));
  }
  centroid = CGAL::centroid(triangles.begin(), triangles.end(),
                            CGAL::Dimension_tag<2>());
}

static int ComputeCentroid(Geometry* geometry) {
  size_t size = geometry->size();
  geometry->copyInputMeshesToOutputMeshes();
  geometry->transformToAbsoluteFrame();
  geometry->convertPolygonsToPlanarMeshes();
  for (size_t nth = 0; nth < size; nth++) {
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
